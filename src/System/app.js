App = {
	init: function(app,server) {
		app.use('/tmp',server.static(__dirname + require('path').sep+'tmp'));	
		app.post('/',app.UPLOAD.any(),function(req,res,next) {
			App.upload.up(req,res);
		});
		app.get('/excel/(*)',function(req,res) {

			console.log(req.query);

			var step = req.query.step.split(',');
			var dateDebut=req.query.dateDebut.split('T')[0];
			var dateFin=req.query.dateFin.split('T')[0];

			var where = 'WHERE id.DateDemande >= \'' + dateDebut + '\' AND id.DateDemande <= \'' + dateFin + '\'';

			for(var i = 0 ; i < step.length ; i++){
				if (step[i]!="") where += ' AND Etape != ' + step[i];
			}

				function getExcel() {
					var db = App.using('db');
					db.model("infocentre","SELECT "+
									"id.IdDemande"+
									", bs.LibSubC"+
									", concat(ba.Nom,' ',ba.Prenom) NomPre"+
									", bi.LibUnic"+
									", DateDemande"+
									", ni.LibelleNature"+
									", id.Operation"+
									", id.Operation"+
									", id.Details"+
									", id.Priorite"+
									", id.UsageCollectif"+
									", id.DateValidation"+
									", id.Etape"+
									", id.CreditSpecifique"+
									", si.LibelleSousNature "+
									"FROM infocentre.demandes id "+
									"JOIN bpclight.agents ba ON ba.Kage = id.IdKage "+
									"JOIN bpclight.subdis bs ON bs.Ksub = ba.Ksub "+
									"JOIN bpclight.unites bi ON bi.Kuni = bs.Kuni "+
									"JOIN infocentre.natures ni ON ni.IdNature = id.IdNature "+
									"LEFT JOIN infocentre.sousnatures si ON si.IdSousNature = id.IdSousNature " + where + " ORDER BY id.IdDemande DESC",function(e,r){
						var data = r.data;

						var Excel = MyService.using("exceljs");
						var workbook = new Excel.Workbook();

						// fetch sheet by id
						var sheet = workbook.addWorksheet('cerema');

						sheet.columns = [
						    { header: "Id", key: "id", width: 20 },
						    { header: "Service", key: "service", width: 20 },
						    { header: "Beneficiaire", key: "beneficiaire", width: 20 },
						    { header: "Demandé le", key: "demande", width: 20 },
						    { header: "Nature", key: "nature", width: 20 },
						    { header: "Sous Nature", key: "sousnature", width: 20 },
						    { header: "N/R", key: "nr", width: 20 },
						    { header: "Détails", key: "details", width: 20 },
						    { header: "Commentaire", key: "commentaire", width: 20 },
						    { header: "Validé le", key: "valide", width: 20 },
						    { header: "Priotité", key: "prorite", width: 20 },
						    { header: "Usage Colectif", key: "usage", width: 20 },
						    { header: "Etape", key: "etape", width: 20 },
						    { header: "Spe", key: "spe", width: 20 }
						];
						for(var i = 0 ; i < data.length ; i++){
							sheet.addRow([data[i].IdDemande,data[i].LibSubC,data[i].NomPre,data[i].DateDemande,data[i].LibelleNature,data[i].LibelleSousNature,data[i].Operation,data[i].Details,data[i].Commentaire,data[i].DateValidation,data[i].Priorite,data[i].UsageCollectif,data[i].Etape,data[i].CreditSpecifique]);
						}


					    var fs=require('fs');
					    var stream=fs.createWriteStream("file.xlsx");
					    workbook.xlsx.write(stream).then(function() {
					    	var stream2=fs.createReadStream("file.xlsx");
					    	stream2.pipe(stream).on('finish',function() {
					    		res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
					    		res.setHeader('Content-disposition', 'attachment; filename=infocentre.xlsx');
					    		stream2.pipe(res);
					    	});
					    });
				});
			};

			getExcel();

		})
	}
};

module.exports = App;