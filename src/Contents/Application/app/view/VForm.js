
App.view.define('VForm', 
	{
		extend: 'Ext.window.Window',
		alias : 'widget.VForm',
		width: 700,
		closable: true,
		draggable: true,
		closeAction: 'destroy',
		labelWidth: 125,
		hidden: true,
		frame: false,
		title: 'Infocentre',
		bodyStyle:'padding:5px 5px 0',
		bbar: 
		[			
			{
				xtype: "numberfield",
				itemId: "nCopy",
				labelField: "Copier",
				value: 1,
				width: 100,
				hidden: true				
			},
			{
				xtype: "button",
				itemId: "btnCopy",
				text: "Dupliquer",
				iconCls: "ico-duplicate",
				hidden: true				
			},			
			{
				xtype: "button",
				itemId: "btnDeclasser",
				text: "Sans suite",
				hidden: true
			},	
			{
				xtype: "button",
				itemId: "btnAbandon",
				iconCls: "trash",
				text: "Abandonner",
				hidden: true
			},			
			{
				xtype: "button",
				itemId: "btnValider",
				text: "Valider",
				hidden: true
			},				
			{
				xtype: "button",
				itemId: "btnCommander",
				text: "Commander",
				hidden: true
			},				
			{
				xtype: "button",
				itemId: "btnDisponible",
				text: "Disponible",
				hidden: true
			},				
			{
				xtype: "button",
				itemId: "btninstall",
				text: "Installé",
				hidden: true
			},
			'->',
			{
				xtype: "button",
				itemId: "btnAnnuler",
				text: "Annuler",
				hidden: true
			},			
			{
				xtype: "button",
				itemId: "btnEnregistrer",
				text: "<b>Enregistrer</b>",
				hidden: true
			},			
			{
				xtype: "button",
				itemId: "btnMaj",
				text: "<b>Mise à jour</b>",
				hidden: true
			},			
			{
				xtype: "button",
				itemId: "btnCloture",
				text: "<b>Clôturé</b>",
				hidden: true
			}
		],
		defaults:{},
		items:[	
			{
				layout: "vbox",
				width: 700,
				margin:{ 
					top: -5,
					bottom: 0,
					left: -5,
					right: 0	
				},
				border: false,
				items:[									
					{
						layout: "hbox",								
						width: 665,
						margin:{
							top: 10,
							bottom: 0,
							left: 0,
							right: 0
						},
						border: false,
						items: [								
							{
								xtype: "combo",
								itemId: "cboDepartement",
								labelAlign: "top",
								fieldLabel: "Département",
								flex: 2,
								editable: false,
								margin: {
									top: 0,
									bottom: 0,
									left: 20,
									right: 0
								},
								displayField: "LibUnic",
								valueField: "Kuni", 
								store: App.store.create('App.MyService.getDepartement',{
									autoLoad: true
								})
							},
							{
								xtype: "combo",
								itemId: "cboService",
								labelAlign: "top",
								fieldLabel: "Service",
								disabled: true,
								flex: 1,
								editable: false,
								margin: {
									top: 0,
									bottom: 0,
									left: 20,
									right: 0
								},
								displayField: "LibSubC",
								valueField: "Ksub",
								store: App.store.create('App.MyService.getService')
							}
						]	
					},									
					{
						layout: "hbox",								
						width: 665,
						margin: {
							top: 10,
							bottom: 0,
							left: 0,
							right: 0
						},
						border: false,
						items: [								
							{
								xtype: "combo",
								itemId: "cboBeneficiaire",
								labelAlign: "top",
								fieldLabel: "Bénéficiaire",
								flex: 2,
								editable: false,
								disabled: true,
								margin: {
									top: 0,
									bottom: 0,
									left: 20,
									right: 0
								},
								displayField: "NomPre",									
								valueField: "Kage",
								store: App.store.create('App.MyService.getAgent')
							},
							{
								xtype: "combo",
								itemId: "cboDomaine",
								labelAlign: "top",
								fieldLabel: "Domaine métier",
								flex: 1,
								editable: false,										
								margin: {
									top: 0,
									bottom: 0,
									left: 20,
									right: 0
								},
								displayField: "LibelleDomaine",
								valueField: "IdDomaine", 
								store: App.store.create('App.MyService.getDomaine',{
									autoLoad: true
								})
							}

						]	
					},										
					{
						layout: "hbox",								
						width: 665,
						margin: {
							top: 10,
							bottom: 0,
							left: 0,
							right: 0
						},
						border: false,
						items: [									
							{
								xtype: "combo",
								itemId: "cboNature",
								labelAlign: "top",
								fieldLabel: "Nature",
								flex: 1,
								editable: false,
								disabled: true,	
								margin: {
									top: 0,
									bottom: 0,
									left: 20,
									right: 5
								},
								displayField: "LibelleNature",
								valueField: "IdNature",
								store: App.store.create('App.MyService.getNature')
							},
							{
								xtype: "combo",
								itemId: "cboSousNature",
								labelAlign: "top",
								fieldLabel: "Sous Nature",
								flex: 1,
								editable: false,
								disabled: true,
								margin: {
									top: 0,
									bottom: 0,
									left: 0,
									right: 0
								},
								displayField: "LibelleSousNature",
								valueField: "IdSousNature",
								store: App.store.create('App.MyService.getSousNature',{
									autoLoad: true
								})
							},
							{											
								xtype: 'radiogroup',
								itemId: "rgOperation",
								labelAlign: "top",
								fieldLabel: "Type d'opération",
								flex: 1,
								margin: {
									top: 0,
									bottom: 0,
									left: 20,
									right: 0
								},
								vertical: true,
								items: [
									{
										boxLabel: 'Nouveau',
										itemId: "rgO0",
										name: 'rgo',
										inputValue: 'N',
										style: { color: 'black' },
										checked: true
									}, 
									{
										boxLabel: 'Remplacement',
										itemId: "rgO1",
										name: 'rgo',
										inputValue: 'R',
										style: { color: 'black' }
									}
								]
							}										
						]	
					},
					{
						layout: "hbox",								
						width: 665,
						margin: {
							top: 10,
							bottom: 0,
							left: 0,
							right: 0
						},
						border: false,
						items: [										
							{
								xtype: "textarea",
								itemId: "txtDemande",
								fieldLabel: "Expression du besoin",
								labelAlign: "top",
								flex: 1,
								margin: {
									top: 0,
									bottom: 0,
									left: 20,
									right: 0
								}
							}
						]	
					},										
					{
						layout: "hbox",								
						width: 665,
						margin: {
							top: 10,
							bottom: 0,
							left: 0,
							right: 0
						},
						border: false,
						items: [								
							{
								xtype: "textarea", 
								itemId: "txtCommentaire",
								fieldLabel: "Commentaire / Observation",
								labelAlign: "top",
								flex: 1,
								disabled: true,
								margin: {
									top: 0,
									bottom: 0,
									left: 20,
									right: 0
								}
							}
						]	
					},										
					{
						layout: "hbox",								
						width: 700,
						margin: {
							top: 10,
							bottom: 0,
							left: 0,
							right: 0
						},
						border: false,
						items: [	
							{

								border: false,
								html: ' <div class="progression">'+
											'<div class="circle active">'+
												'<span class="label">1</span>'+
												'<span class="title">Demande</span>'+
											'</div>'+
											'<span class="bar"></span>'+
											'<div class="circle ">'+
												'<span class="label">2</span>'+
												'<span class="title declasser">Validation</span>'+
											'</div>'+
											'<span class="bar"></span>'+
											'<div class="circle ">'+
												'<span class="label">3</span>'+
												'<span class="title">Commande</span>'+
											'</div>'+
											'<span class="bar"></span>'+
											'<div class="circle">'+
												'<span class="label">4</span>'+
												'<span class="title">Disponible</span>'+
											'</div>'+
											'<span class="bar"></span>'+
											'<div class="circle ">'+
												'<span class="label">5</span>'+
												'<span class="title">Installé</span>'+
											'</div>'+
											'<span class="bar"></span>'+
											'<div class="circle ">'+
												'<span class="label">6</span>'+
												'<span class="title">Clôturé</span>'+
											'</div>'+
										'</div>'
							}
						]	
					},										
					{
						layout: "hbox",								
						width: 550,
						margin: {
							top: 10,
							bottom: 10,
							left: 0,
							right: 0
						},
						border: false,
						items: [														
								{
									xtype: 'label',
									text: 'Priorité : ',
									margin: {
										top: 0,
										bottom: 0,
										left: 20,
										right: 0
									}
								},
								{ 										
									xtype: 'radiogroup',
									itemId: "rgPriorite",
									flex: 1,
									disabled: true,
									vertical: true,
									margin: {
										top: 0,
										bottom: 0,
										left: 20,
										right: 0
									},
									items: 
										[
											{
												boxLabel: 'P0',
												itemId: "rgP0",
												name: 'rgp',
												inputValue: 'P0',
												style: { color: 'red' }
											}, 
											{
												boxLabel: 'P1',
												itemId: "rgP1",
												name: 'rgp',
												inputValue: 'P1',
												style: { color: 'orange' }
												
											}, 
											{
												boxLabel: 'P2',
												itemId: "rgP2",
												name: 'rgp',
												inputValue: 'P2',
												style: { color: 'green' }
											}, 
											{
												boxLabel: 'P3',
												itemId: "rgP3",
												name: 'rgp',
												inputValue: 'P3',
												style: { color: 'purple' }
											}
										]
								},
								{
									xtype: 'checkbox',
									itemId: "cbSpecial",
									boxLabel: 'Crédit Spécifique',
									inputValue: '1',
									disabled: true,
									margin:
										{
											top: 0,
											bottom: 0,
											left: 0,
											right: 0
										},
									style: { color: 'brown' }
								},
								{
									xtype: 'checkbox',
									itemId: "cbUsage",
									boxLabel: 'A faire',
									inputValue: '1',
									margin:
										{
											top: 0,
											bottom: 0,
											left: 30,
											right: 0
										}
								}
							]	
						}
					]
				}
			]
	});