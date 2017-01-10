
 function G_LawManager(askLaw){

	var authorized = false;
	var userLaw = Auth.User.droits;

	for(var i = 0 ; i < askLaw.length && !authorized ; i++){
		for(var e = 0 ; e < userLaw.length && !authorized ; e++){
			if(askLaw[i] == userLaw[e]){
				authorized = true;
			}
		}
	}
	return authorized;
}

App.controller.define('CMain', {

	views: [
		"VMain",
		"VForm",
		"VExcel",
		"VImport",
		"VValidImport"
	],
	
	models: [
	],
	
	init: function() {

		this.control({
			"menu>menuitem": {
				click: "Menu_onClick"
			},
			"VForm button#btnCopy": {
				click: "CopyDemande"	
			},
			"VForm combo": {
				change: "AbilitytoRecord"
			},
			"VForm combo#cboDepartement": {
				change: "NextDepartement"
			},
			"VForm combo#cboService": {
				change: "NextServices"
			},
			"VForm combo#cboDomaine": {
				change: "NextDomaines"
			},
			"VForm combo#cboNature": {
				change: "NextNatures"
			},
			// Button
			"VForm button#btnEnregistrer": {
				click: "Recording"
			},
			"VForm button#btnAnnuler": {
				click: "Cancel"
			},
			"VMain grid#ListPrincipal": {
				itemdblclick: "SelectDemande"
			},
			"VForm button#btnMaj": {
				click: "Update"
			},
			"VForm button#btnValider": {
				click: "Validation"
			},
			"VForm button#btnDeclasser": {
				click: "Declass"
			},
			"VForm button#btnDisponible": {
				click: "Available"
			},
			"VForm button#btnCommander": {
				click: "Command"
			},
			"VForm button#btninstall": {
				click: "Install"
			},
			"VForm button#btnCloture": {
				click: "Cloturer"
			},
			"VExcel button#btnTelechargerExcel": {
				click: "GetExcel"
			},
			"VImport button#btnTelechargerExcel": {
				click: "DoImport"
			},
			"VValidImport button#btnValidIport": {
				click: "MkImport"
			}
		});
		
		App.init('VMain',this.onLoad);
		
	},
	CopyDemande: function(me) {
		var demande=me.up('window').IdDemande;
		App.DB.get('infocentre://demandes?IdDemande='+demande,function(r){
			r=r.data[0];
			delete r.IdDemande;
			var tab=[];
			for (var i=0;i<App.get('VForm numberfield#nCopy').getValue();i++) tab.push(r);
			App.DB.post('infocentre://demandes',tab,function(ra){
				App.notify('Vos enregistrements ont bien été copiés.');
				App.get("VMain grid").getStore().load();
				me.up('window').close();
			})
		});
	},
	MkImport: function(){
		App.info.loading('Chargement');
		var count = 0;
		ImportExcel = this.ImportExcel;
		for(var i = 0 ; i < ImportExcel.length ; i++){
			App.DB.post('infocentre://demandes',{
	            IdNature: ImportExcel[i].IdNature,
	            IdSousNature: ImportExcel[i].IdSousNature,
	            Auteur: Auth.User.uid,
	            DateDemande: new Date(ImportExcel[i].DateDemande),
	            IdKuni: ImportExcel[i].Kuni,
	            IdKsub: ImportExcel[i].Ksub,
	            IdKage: ImportExcel[i].Kage,
	            Details: ImportExcel[i].Details,
	            Operation: ImportExcel[i].Operation
	        }, function(e,r) {
	        	count++;
	        	if(count == ImportExcel.length){
	        		App.get('VValidImport').close();
		        	App.notify('Importation Terminée.');
		        	App.get("grid#ListPrincipal").getStore().load();
		        	App.info.hide();
	        	}
	        });
		}
	},
	DoImport: function() {
		var me = this;
		var files=App.get('VImport uploadfilemanager#up').getFiles();
		App.info.loading('Chargement');
		App.get('VImport').close();
		App.MyService.ImportExcel(files[0].docId,function(e, r){
			App.info.hide();
			me.ImportExcel = r.result;

			if(r.data.length > 0){
				var error = '';
				for(var i = 0 ; i < r.data.length ; i++){
					error +=  r.data[i] + '\r';
				}
				alert(error);
			}

			App.view.create('VValidImport', {
				modal: true,
				title: 'Excel',
				labels:[]
			}).show();

			for(var i = 0 ; i < r.result.length ; i++){
				r.result[i].DateDemande = r.result[i].DateDemande.toDate();
			}

			var tab = { fields: [
				'LibSubC',
				'NomPre',
				{
					name: 'DateDemande',
					type: 'date'
				},
				'LibelleNature',
				'LibelleSousNature',
				'Operation',
				'Details'
				],
				data: r.result
			}

			var store = App.store.create(tab);
			App.get('VValidImport grid#GridImport').bindStore(store);
			App.get('VValidImport grid#GridImport').getStore().load();
		});
	},
	Menu_onClick: function(p) {
		
		// Bouton du Menu > Demande > Nouvelle.
		if(p.itemId == 'menuExcel') {
			App.view.create('VExcel', {
				modal: true,
				title: 'Excel',
				labels:[]
			}).show();

		} else if(p.itemId == 'menuExcelImport'){
			App.view.create('VImport', {
				modal: true,
				title: 'Excel',
				labels:[]
			}).show();
		} else if (p.itemId == 'menuNewRequest'){
			App.view.create('VForm', {
				modal: true,
				title: 'Auteur de la Demande : '+ Auth.User.lastname + ' ' + Auth.User.firstname,
				labels:[]
			}).show();

			// Vérouille le domaine sur informatique.
			App.get('VForm combo#cboDomaine').setDisabled(true);
			App.get('VForm combo#cboDomaine').getStore().load();
			App.get('VForm combo#cboDomaine').select(1);

			App.get('VForm button#btnEnregistrer').setDisabled(true);
			App.get('VForm button#btnEnregistrer').show();
			App.get('VForm button#btnAnnuler').show();

			// Vérouille le département selon les droits de l'utilisateur.
			if(!G_LawManager([1,2])) {
				App.get('VForm combo#cboDepartement').setDisabled(true);
				App.get('VForm combo#cboDepartement').getStore().load();
				App.get('VForm combo#cboDepartement').select(Auth.User.kuni);
			}
		} else if (p.xtype == 'menucheckitem'){
			var menu = App.get('#menuStep').menu.items.items;
			var Etape = [];
			for(var i = 0 ; i < menu.length ; i++){
				if(!menu[i].checked){
					Etape.push(menu[i].value);
				}
			}
			App.get('grid#ListPrincipal').getStore().getProxy().extraParams.Etape = Etape;

			var menu = App.get('#menuPrio').menu.items.items;
			var Priorite = [];
			for(var i = 0 ; i < menu.length ; i++){
				if(!menu[i].checked){
					Priorite.push(menu[i].value);
				}
			}
			App.get('grid#ListPrincipal').getStore().getProxy().extraParams.Priorite = Priorite;
			App.get('grid#ListPrincipal').getStore().load();
		}
	},
	onLoad: function() {
		Auth.login(function(){
			var dd=new Date();
			var currentyear=dd.getFullYear();
			var ddtab=[];
			ddtab.push({year: currentyear-1});
			ddtab.push({year: currentyear});
			ddtab.push({year: currentyear+1});
			
			var store=App.store.create({
				fields: ["year"],
				data: ddtab
			});
			
			App.get('VMain combo#Year').bindStore(store);
			
			App.get('VMain combo#Year').setValue(currentyear);
			
			console.log(Auth.User);
			// Gestion des droits.
			var lawUser = Auth.User.profil;
			var Etape = [];
			var Priorite = [];
			var store = App.get('grid#ListPrincipal').getStore();

			Etape.push(6);
			store.getProxy().extraParams.Etape = Etape;
			Priorite.push('PP');
			store.getProxy().extraParams.Priorite = Priorite;
			if(!G_LawManager([1,2])) {
				store.getProxy().extraParams.kuni = Auth.User.kuni;
			}
			store.on('load',function(){
				var models = App.get('VMain grid#ListPrincipal').getStore().getRange();
				for(var i = 0 ; i < models.length ; i++){
					if(models[i].data.Etape >= 5){
						models[i].set('Installe', true);
						if(models[i].data.Etape == 6){
							models[i].set('Cloture', true);
						}
					} 
				}
			});
			store.load();
			if(!G_LawManager([1,2,3])) {
				App.get('#menuRequest').hide();
				App.get('#menuDisplay').hide();
			}
		});
	},
	NextDepartement: function(obj, newValue, oldValue, eOpts){
		if(newValue != ''){
			// Reset les combo lié au département
			App.get('VForm combo#cboService').getStore().removeAll();
			App.get('VForm combo#cboBeneficiaire').getStore().removeAll();
			App.get('VForm combo#cboBeneficiaire').setValue("");
			App.get('VForm combo#cboService').setValue("");
			App.get('VForm combo#cboBeneficiaire').setDisabled(true);
			App.get('VForm combo#cboService').setDisabled(false);
			App.get('VForm combo#cboService').getStore().getProxy().extraParams.kuni = newValue;
			App.get('VForm combo#cboService').getStore().load();
		}
	},
	NextServices: function(obj, newValue, oldValue, eOpts){
		if(newValue != ''){
			// Reset les combo lié au service
			App.get('VForm combo#cboBeneficiaire').getStore().removeAll();
			App.get('VForm combo#cboBeneficiaire').setValue("");

			if(App.get('VForm combo#cboService').getValue() != ''){
				App.get('VForm combo#cboBeneficiaire').setDisabled(false);
				App.get('VForm combo#cboBeneficiaire').getStore().getProxy().extraParams.Ksub = newValue;
				App.get('VForm combo#cboBeneficiaire').getStore().load();
			}
		}
	},
	NextDomaines: function(obj, newValue, oldValue, eOpts){
		if(newValue != ''){
			// Reset les combo lié au Domaine
			App.get('VForm combo#cboNature').getStore().removeAll();
			App.get('VForm combo#cboNature').setValue("");
			App.get('VForm combo#cboSousNature').getStore().removeAll();
			App.get('VForm combo#cboSousNature').setValue("");
			App.get('VForm combo#cboSousNature').setDisabled(true);

			App.get('VForm combo#cboNature').setDisabled(false);
			App.get('VForm combo#cboNature').getStore().getProxy().extraParams.IdDomaine = newValue;
			App.get('VForm combo#cboNature').getStore().load();
		}
	},
	NextNatures: function(obj, newValue, oldValue, eOpts){
		if(newValue != ''){
			// Reset les combo lié a la nature
			App.get('VForm combo#cboSousNature').getStore().removeAll();
			App.get('VForm combo#cboSousNature').setValue("");
			
			if (App.get('VForm combo#cboNature').getValue() != '') {
				App.get('VForm combo#cboSousNature').setDisabled(false);
				App.get('VForm combo#cboSousNature').getStore().getProxy().extraParams.IdNature = newValue;
				App.get('VForm combo#cboSousNature').getStore().load();
			}
		}
	},
	AbilitytoRecord: function(){
		if(typeof App.get('VForm combo#cboNature').getValue() === 'number' && typeof App.get('VForm combo#cboBeneficiaire').getValue()  === 'number' ){
			App.get('VForm button#btnEnregistrer').setDisabled(false);
		} else {
			App.get('VForm button#btnEnregistrer').setDisabled(true);
		}
	},
	Recording: function(){
		App.DB.post('infocentre://demandes',{
            IdNature: App.get('VForm combo#cboNature').getValue(),
            IdSousNature: App.get('VForm combo#cboSousNature').getValue(),
            Auteur: Auth.User.uid,
            DateDemande: new Date(),
            IdKuni: App.get('VForm combo#cboDepartement').getValue(),
            IdKsub: App.get('VForm combo#cboService').getValue(),
            IdKage: App.get('VForm combo#cboBeneficiaire').getValue(),
            UsageCollectif: App.get('VForm checkbox#cbUsage').getValue(),
            Details: App.get('VForm textarea#txtDemande').getValue(),
            Priorite: 'P3',
            Etape: 1,
            Operation: App.get('VForm radiogroup#rgOperation').getValue().rgo
        }, function(e,r) {
        	App.get('VForm').close();
        	App.notify('Demande Enregistrée.');
        	App.get("grid#ListPrincipal").getStore().load();
        });
	},
	Cancel: function(){
		App.get('VForm').close();
	},
	SelectDemande: function(obj, record, item, index, e, eOpts){

 		var me = this;
 		this.IdDemandeSelected = record.data.IdDemande;
		App.MyService.GenerateDemande(record.data.IdDemande,function(e, r){
			if(e.success){
	        	var data = e.data[0];	        	
				
				

	        	App.info.loading('Chargement');
	        	App.view.create('VForm',{
					modal: true,
					title: 'Auteur de la Demande : ' + data.NomPre,
					IdDemande: data.IdDemande,
					labels:[]
				}).show();
	        	
				if (data.Etape<2) {
					App.get('VForm button#btnCopy').show();
					App.get('VForm numberfield#nCopy').show();
				};
				
	        	App.get('combo#cboDepartement').getStore().load(function(r){
	        		App.get('VForm combo#cboDepartement').select(data.IdKuni);
		    		App.get('combo#cboService').getStore().load(function(r){
			    		App.get('VForm combo#cboService').select(data.IdKsub);
			    		App.get('combo#cboBeneficiaire').getStore().load(function(r){
				    		App.get('VForm combo#cboBeneficiaire').select(data.IdKage);
				        	App.get('combo#cboDomaine').getStore().load(function(r){
				        		App.get('VForm combo#cboDomaine').select(data.IdDomaine);
				        		App.get('combo#cboNature').getStore().load(function(r){
					        		App.get('VForm combo#cboNature').select(data.IdNature);
					        		App.get('combo#cboSousNature').getStore().load(function(r){
						        		App.get('VForm combo#cboSousNature').select(data.IdSousNature);
						        		App.get('VForm textarea#txtCommentaire').setValue(data.Commentaire);
						        		App.get('VForm textarea#txtDemande').setValue(data.Details);
						        		App.get('VForm checkbox#cbSpecial').setValue(data.CreditSpecifique);
						        		App.get('VForm checkbox#cbUsage').setValue(data.UsageCollectif);

						        		if(data.Operation == 'N') App.get('VForm radio#rgO0').setValue(true);
						        		if(data.Operation == 'R') App.get('VForm radio#rgO1').setValue(true);

						        		if(data.Priorite == 'P0') App.get('VForm radio#rgP0').setValue(true);
						        		if(data.Priorite == 'P1') App.get('VForm radio#rgP1').setValue(true);
						        		if(data.Priorite == 'P2') App.get('VForm radio#rgP2').setValue(true);
						        		if(data.Priorite == 'P3') App.get('VForm radio#rgP3').setValue(true);

										if(!G_LawManager([1])){
							        		App.get('VForm combo#cboDepartement').setDisabled(true);
							        		App.get('VForm combo#cboService').setDisabled(true);
							        		App.get('VForm combo#cboBeneficiaire').setDisabled(true);
							        		App.get('VForm combo#cboDomaine').setDisabled(true);
						        			App.get('VForm combo#cboNature').setDisabled(true);
						        			App.get('VForm combo#cboSousNature').setDisabled(true);
						        			App.get('radiogroup#rgOperation').setDisabled(true);
							        		App.get('VForm textarea#txtDemande').setDisabled(true);
							        		App.get('VForm button#btnEnregistrer').setDisabled(true);
							        		App.get('VForm checkbox#cbUsage').setDisabled(true);
	        							} else {
											App.get('VForm button#btnMaj').show();
							        		App.get('VForm button#btnAnnuler').show();
							        		App.get('VForm textarea#txtCommentaire').setDisabled(false);
							        		App.get('VForm radiogroup#rgPriorite').setDisabled(false);
										    App.get('VForm checkbox#cbSpecial').setDisabled(false);
	        							}

	        							if(data.Declasser == 0){

											if(G_LawManager([1])){
			        							if(data.Etape == 1){
									        		App.get('VForm button#btnValider').show();
										        	App.get('VForm button#btnDeclasser').show(); 
												} else if(data.Etape == 2){
													me.Step2();
												} else if(data.Etape == 3) {
													me.Step3();
												}
											}

											if(G_LawManager([1,2])){
												App.get('VForm button#btnMaj').show();
								        		App.get('VForm button#btnAnnuler').show();
								        		App.get('VForm textarea#txtCommentaire').setDisabled(false);
												if(data.Etape == 4) {
								        			me.Step4();
								        		}
		        							} 

		        							if(G_LawManager([1,2,3])){
												if(data.Etape == 5) {
								        			me.Step5();
								        		}
		        							} 

											// Jquery Progress Bar
											me.Progressbar(1,data.Etape+1);

										} else {
											$('.progression .circle:nth-of-type(2)').removeClass('active').addClass('done');
											$('.progression .circle:nth-of-type(1)').removeClass('active').addClass('done');
											$('.progression .bar:nth-of-type(1)').addClass('done');
											$('.declasser').css('color','red');
											$('.declasser').html('Declasser');
											if(G_LawManager([1])){
												App.get('VForm button#btnValider').idDemande = data.IdDemande;
												App.get('VForm button#btnValider').show();
											}
										}
										App.info.hide();
									});
								});
							});
			    		});
		    		});
				});
	        }
		});
	},
	Progressbar: function(i,count){
		setInterval(function() {
			if(i <= count){
				$('.progression .circle:nth-of-type(' + i + ')').addClass('active');
				$('.progression .circle:nth-of-type(' + (i - 1) + ')').removeClass('active').addClass('done');
				$('.progression .circle:nth-of-type(' + (i - 1) + ') .label').html('&#10003;');
				$('.progression .bar:nth-of-type(' + (i - 1) + ')').addClass('active');
				$('.progression .bar:nth-of-type(' + (i - 2) + ')').removeClass('active').addClass('done');
				i++;
			}
		}, 80);
	},
	Validation: function(obj){
		var me = this;
		var date = new Date();
		App.DB.post('infocentre://demandes',{
            IdDemande: me.IdDemandeSelected,
            DateValidation: date,
            Etape: 2,
            Declasser: 0
        }, function(e,r) {
        	me.Progressbar(2,3);
        	me.ChangeValueEtape(2);
        	$('.declasser').css('color','#444');
			$('.declasser').html('Declasser');
        	App.get('VForm button#btnValider').hide();
			App.get('VForm button#btnDeclasser').hide();
			me.Step2();
        });
	},
	Declass: function(obj){
		var me = this;
		App.DB.post('infocentre://demandes',{
            IdDemande: me.IdDemandeSelected,
            Declasser: 1
        }, function(e,r) {
        	$('.progression .circle:nth-of-type(2)').removeClass('active').addClass('done');
			$('.progression .circle:nth-of-type(1)').removeClass('active').addClass('done');
			$('.progression .bar:nth-of-type(1)').addClass('done');
			$('.declasser').css('color','red');
			$('.declasser').html('Declasser');
        	App.get('VForm button#btnDeclasser').hide();
        });
	},
	Command: function(obj){
		var me = this;
		App.DB.post('infocentre://demandes',{
            IdDemande: me.IdDemandeSelected,
            Etape: 3
        }, function(e,r) {
        	me.Progressbar(3,4);
        	me.ChangeValueEtape(3);
        	me.Step3();
        });
	},
	Available: function(obj){
		var me = this;
		App.DB.post('infocentre://demandes',{
            IdDemande: me.IdDemandeSelected,
            Etape: 4
        }, function(e,r) {
        	me.Progressbar(4,5);
        	me.ChangeValueEtape(4);
        	me.Step4();
        });
	},
	Install: function(obj){
		var me = this;
		App.DB.post('infocentre://demandes',{
            IdDemande: me.IdDemandeSelected,
            Etape: 5
        }, function(e,r) {
        	me.Progressbar(5,6);
        	me.ChangeValueEtape(5);
        	me.Step5();
        });
	},
	Cloturer : function(obj){
		var me = this;
		App.DB.post('infocentre://demandes',{
            IdDemande: me.IdDemandeSelected,
            Etape: 6
        }, function(e,r) {
        	me.Progressbar(6,7);
        	me.ChangeValueEtape(6);
        	App.get('VForm button#btnCloture').hide();
        	App.get('grid#ListPrincipal').getStore().load();
        });
	},
	Update: function(){
		App.DB.post('infocentre://demandes',{
			IdDemande: this.IdDemandeSelected,
            IdNature: App.get('VForm combo#cboNature').getValue(),
            IdSousNature: App.get('VForm combo#cboSousNature').getValue(),
            IdKuni: App.get('VForm combo#cboDepartement').getValue(),
            IdKsub: App.get('VForm combo#cboService').getValue(),
            IdKage: App.get('VForm combo#cboBeneficiaire').getValue(),
            UsageCollectif: App.get('VForm checkbox#cbUsage').getValue(),
            Details: App.get('VForm textarea#txtDemande').getValue(),
            Commentaire: App.get('VForm textarea#txtCommentaire').getValue(),
            Priorite: App.get('VForm radiogroup#rgPriorite').getValue().rgp,
            CreditSpecifique: App.get('VForm checkbox#cbSpecial').getValue(),
            Operation: App.get('VForm radiogroup#rgOperation').getValue().rgo
        }, function(e,r) {
        	App.get('VForm').close();
        	App.get("grid#ListPrincipal").getStore().load();
        	App.notify('Demande mise à jour.');
        });
	},
	ChangeValueEtape: function(etape){
		var models = App.get('VMain grid#ListPrincipal').getStore().getRange();
		var index = App.get('VMain grid#ListPrincipal').getSelectionModel().getSelection()[0].index;
		models[index].set('Etape', etape);
	},
	Step2: function(){
		App.get('VForm button#btnCommander').show();
		App.get('VForm button#btnDisponible').show();
	},
	Step3: function(){
		App.get('VForm button#btnCommander').hide();
		App.get('VForm button#btnDisponible').show();
	},
	Step4: function(){
		App.get('VForm button#btnDisponible').hide();
		App.get('VForm button#btnCommander').hide();
		App.get('VForm button#btninstall').show();
	},
	Step5: function(){
		App.get('VForm button#btninstall').hide();
		App.get('VForm button#btnCloture').show();
	},
	GetExcel: function(){
		var send = [];
		var step = [];

		var dateDebut = App.get('VExcel datefield#debut').getValue();
		var dateFin = App.get('VExcel datefield#fin').getValue();

		if(dateDebut == null){
			dateDebut = new Date('1970-01-01');
		}
		if(dateFin == null){
			dateFin = new Date();
		}

		send.push('dateDebut='+dateDebut.toString("yyyy-MM-dd"));
		send.push('dateFin='+dateFin.toString("yyyy-MM-dd"));

		for(var i = 1 ; i <= 6 ; i++){
			if(!App.get('VExcel checkbox#cbstep'+i).getValue()){
				step.push(i);
			}
		}

		send.push('step='+step.join(','));

		window.open(Settings.REMOTE_API +'/excel/?'+send.join('&'), '_blank');
		App.get('VExcel').close();
	}
});
