
App.view.define('VValidImport', 
	{
		extend: 'Ext.window.Window',
		alias : 'widget.VValidImport',
		width: 800,
		height: 500,
		layout: "fit",
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
			'->',			
			{
				xtype: "button",
				itemId: "btnValidIport",
				text: "Valider"
			}
		],
		defaults:{},
		items:[
			{
				xtype: "grid",
				itemId: "GridImport",
				width: "100%",

				features: [
					{
						groupHeaderTpl: 'Département: {name}',
						ftype: 'groupingsummary'
					}
				],		
				tbar:[],
				columns:[										
					{
						flex: 1,
						text: "Service",
						dataIndex: "LibSubC"
					},
					{
						flex: 3,
						text: "Beneficiaire",
						dataIndex: "NomPre"
					},	
					{
						flex: 2,
						text: 'Demandé le',
						dataIndex: 'DateDemande',
						renderer: Ext.util.Format.dateRenderer('Y-m-d')
					},										
					{
						flex: 2,
						text: "Nature",
						dataIndex: "LibelleNature"										
					},
					{
						flex: 2,
						text: "Sous nature",
						dataIndex: "LibelleSousNature"
					},
					{
						flex: 1,
						text: "N/R",
						dataIndex: "Operation"
					},
					{
						flex: 5,
						text: "Detail",
						dataIndex: "Details"
					}	
				]						
			}
		]
	});