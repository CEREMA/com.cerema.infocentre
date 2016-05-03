
MyService = {
	GenerateList: function(o,cb){
		var where = '';
		var iswhere = false;

		if(o.Etape && o.Etape.length > 0) {
			for(var i = 0 ; i < o.Etape.length ; i++){
				if(i > 0) where += ' AND';
				where += ' id.Etape != ' + o.Etape[i];
			}
		} else {
			where += ' id.Etape != ' + 0;
		}

		if(o.Priorite && o.Priorite.length > 0) {
			for(var i = 0 ; i < o.Priorite.length ; i++){
				where += " AND id.Priorite != \'" + o.Priorite[i] + "\'";
			}
		} else {
			where += " AND id.Priorite != \'PP\'";
		}
		
		where = ' WHERE' + where;

		var db = MyService.using('db');
		db.model("infocentre",	"SELECT "+
								"id.IdDemande"+
								", bs.LibSubC"+
								", concat(ba.Nom,' ',ba.Prenom) NomPre"+
								", bi.LibUnic"+
								", DateDemande"+
								", ni.LibelleNature"+
								", id.Operation"+
								", id.Details"+
								", id.Priorite"+
								", id.DateValidation"+
								", id.Etape"+
								", id.CreditSpecifique"+
								", si.LibelleSousNature "+
								"FROM infocentre.demandes id "+
								"JOIN bpclight.agents ba ON ba.Kage = id.IdKage "+
								"JOIN bpclight.subdis bs ON bs.Ksub = ba.Ksub "+
								"JOIN bpclight.unites bi ON bi.Kuni = bs.Kuni "+
								"JOIN infocentre.natures ni ON ni.IdNature = id.IdNature "+
								"LEFT JOIN infocentre.sousnatures si ON si.IdSousNature = id.IdSousNature " + where + " ORDER BY IdDemande DESC"
		,function(e,r){
			cb(r);
		});
	},

// Nouvelle Demande
	getDepartement: function(o,cb){
		var db = MyService.using('db');
		db.model("bpclight","SELECT Kuni,LibUnic FROM unites WHERE archive=0 ORDER BY LibUnic",cb);
	},
	getService: function(o,cb){
		var db = MyService.using('db');
		db.model("bpclight",'SELECT LibSubC,Ksub FROM subdis WHERE archive=0 and Kuni = ' + o.kuni + ' ORDER BY LibSubC',cb );
	},
	getAgent: function(o,cb){
		var db = MyService.using('db');
		db.model("bpclight","SELECT concat(Nom,' ',Prenom) NomPre,Kage FROM agents WHERE Ksub = " + o.Ksub  + " AND Actif = 1 ORDER BY NomPre",cb);
	},
	getDomaine: function(o,cb){
		var db = MyService.using('db');
		db.model("infocentre","SELECT * FROM domaines",cb);
	},
	getNature: function(o,cb){
		var db = MyService.using('db');
		db.model("infocentre","SELECT IdNature,LibelleNature FROM natures WHERE IdDomaine = " + o.IdDomaine + ' ORDER BY LibelleNature',cb);
	},
	getSousNature: function(o,cb){
		var db = MyService.using('db');
		db.model("infocentre","SELECT IdSousNature,LibelleSousNature FROM sousnatures WHERE IdNature = " + o.IdNature + " ORDER BY LibelleSousNature",cb);
	},
	GenerateDemande: function(IdDemande,cb){
		var db = MyService.using('db');
		db.model("infocentre","SELECT de.*,n.*,do.*, concat(ba.Nom,' ',ba.Prenom) NomPre FROM demandes de "+
			"JOIN natures n ON n.IdNature = de.IdNature "+
			"JOIN domaines do ON do.IdDomaine = n.IdDomaine "+
			"JOIN bpclight.agents ba ON de.Auteur = ba.Kage "+
			"WHERE de.IdDemande = " + IdDemande,cb);
	},
	ImportExcel: function(id,cb){

		var Excel = MyService.using("exceljs");
		var workbook = new Excel.Workbook();
		var db = MyService.using('db');
		var count = 1;
		var heightRow = 0;
		var tabDemande = [];
		var tabError = [];
		var callback = function(){
			count++;
			if(count == heightRow){
				cb(tabError, tabDemande);
			}
		};

		workbook.xlsx.readFile(id)
		    .then(function() {
	    		var worksheet = workbook.getWorksheet(1);
	    		worksheet.eachRow(function(row, rowNumber) {
	    			heightRow++;
	    		});
				worksheet.eachRow(function(row, rowNumber) {
				    if(rowNumber != 1){
				    	var dataRow = row.values;
				    	var condName = dataRow[2].split(' ');
				    	var dataDemande;

				    	if(condName[1] && condName[1] != ''){
				    		condName = " AND a.Nom = '" + condName[0] + "' AND a.Prenom = '" + condName[0] +"'";
				    	} else {
				    		condName = " AND a.Nom = '" + condName[0] + "'";
				    	}

						db.model("bpclight","SELECT s.Ksub, s.LibSubC, s.Kuni, a.Kage, concat(a.Nom,' ',a.Prenom) NomPre  FROM subdis s JOIN agents a ON a.Ksub = s.Ksub WHERE s.LibSubC = '" + dataRow[1] + "' " + condName,function(e,r){
							dataDemande = r.data[0];
							if(dataDemande){
								db.model("infocentre","SELECT IdNature,LibelleNature FROM natures WHERE LibelleNature = '" + dataRow[4] + "'",function(e,r){
									if(r.data[0] && r.data[0].IdNature){
										dataDemande['IdNature'] = r.data[0].IdNature;
										dataDemande['LibelleNature'] = r.data[0].LibelleNature;
										db.model("infocentre","SELECT IdSousNature,LibelleSousNature FROM sousnatures WHERE LibelleSousNature = '" + dataRow[5] + "'",function(e,r){
											if(r.data[0] && r.data[0].IdSousNature){
												dataDemande['IdSousNature'] = r.data[0].IdSousNature;
												dataDemande['LibelleSousNature'] = r.data[0].LibelleSousNature;
											}
											dataDemande['DateDemande'] = new Date((dataRow[3] - (25567 + 2))*86400*1000);
											dataDemande['Operation'] = dataRow[6];
											dataDemande['Details'] = dataRow[7];
											tabDemande.push(dataDemande);
											callback();
										});
									} else {
										tabError.push('Row : ' + rowNumber + ' - La Nature : ' + dataRow[4] + ' est introuvable');
										callback();
									}
								});
							} else {
								tabError.push('Row : ' + rowNumber + ' - La Personne ' + dataRow[2] + ' est introuvable');
								callback();
							}
						});
				    }
				});
		    });
	}
}

module.exports = MyService;
