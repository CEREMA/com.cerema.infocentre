
App.view.define('VExcel', 
	{
		extend: 'Ext.window.Window',
		alias : 'widget.VExcel',
		width: 315,
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
				itemId: "btnTelechargerExcel",
				text: "Télécharger"
			}
		],
		defaults:{},
		items:[
			{
				layout: "vbox",
				width: 300,
				margin:{ 
					top: -5,
					bottom: 0,
					left: -5,
					right: 0	
				},
				border: false,
				items:[	
					{
				        xtype: 'datefield',
				        itemId: 'debut',
				        anchor: '100%',
				        fieldLabel: 'De',
				        name: 'date',
				        format: 'm d Y',
				        value: '2 4 1978',
				        margin:{ 
							top: 10,
							bottom: 0,
							left: 10,
							right: 0	
						}
				    }, 
				    {
				        xtype: 'datefield',
				        itemId: 'fin',
				        anchor: '100%',
				        fieldLabel: 'à',
				        name: 'date',
				        format: 'm d Y',
				        altFormats: 'm,d,Y|m.d.Y',
				        value: '2.4.1978',
				        margin:{ 
							top: 5,
							bottom: 0,
							left: 10,
							right: 0	
						}
				    },
				    {
				    	layout: "hbox",								
						width: 300,
						margin:{
							top: 10,
							bottom: 0,
							left: 10,
							right: 0
						},
						border: false,
				    	items:[
							{
								xtype: 'checkbox',
								itemId: "cbstep1",
								boxLabel: 'Demande',
								inputValue: '1',
				        		checked : true,
								flex:1
							},
							{
								xtype: 'checkbox',
								itemId: "cbstep2",
								boxLabel: 'Valider',
								inputValue: '2',
				        		checked : true,
								flex:1
							},
							{
								xtype: 'checkbox',
								itemId: "cbstep3",
								boxLabel: 'Commande',
								inputValue: '3',
				        		checked : true,
								flex:1
							}
						]
					},
					,
				    {
				    	layout: "hbox",								
						width: 300,
						margin:{
							top: 10,
							bottom: 10,
							left: 10,
							right: 0
						},
						border: false,
				    	items:[
							{
								xtype: 'checkbox',
								itemId: "cbstep4",
								boxLabel: 'Disponible',
								inputValue: '4',
				        		checked : true,
								flex:1
							},
							{
								xtype: 'checkbox',
								itemId: "cbstep5",
								boxLabel: 'Installer',
								inputValue: '5',
				        		checked : true,
								flex:1
							},
							{
								xtype: 'checkbox',
								itemId: "cbstep6",
								boxLabel: 'Clôturer',
								inputValue: '6',
				        		checked : true,
								flex:1
							}
						]
					}
				]
			}
		]
	});