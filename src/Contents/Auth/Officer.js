Officer = {
	login : function(profile,auth_type,cb)
	{
		if (auth_type=="cas") {
			if (!profile.username) cb({});
			var mail=profile.username.toLowerCase();
			Officer.using('db').store('bpclight','select kage,nom,prenom,kuni,ksub from agents where kage in (select kage from mela where libmela="'+mail+'")',function(err,result){
				if (!err) {
					var response={
						lastname: result.data[0].nom,
						firstname: result.data[0].prenom,
						uid: result.data[0].kage,
						mail: mail,
						kuni: result.data[0].kuni,
						ksub: result.data[0].ksub
					};
					Officer.using('db').store('infocentre',	'SELECT p.IdDroit from possederdroits p '+
															'JOIN bpclight.agents ba ON ba.Kage = p.IdProfil '+
															'WHERE ba.Kage = ' + result.data[0].kage,
						function(err,result) {
						console.log(err);
						if(result.data.length > 0){
							var tmp = [];
							for(var i = 0 ; i < result.data.length ; i++){
								tmp.push(result.data[i].IdDroit);
							}
							response.droits = tmp;
						} else {
							response.droits = 0;
						}
						cb(response);		
					});
				} else cb(err);
			});
		};
		
	}
};

module.exports = Officer;