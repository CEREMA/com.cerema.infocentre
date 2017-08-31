App.view.define('VMain', {

    extend: 'Ext.Panel',
	alias : 'widget.VMain',
	border: false,
	layout: "border",
	
	items: [
		{
			region: 'north',
			height: 25,
			minHeight: 25,
			border:false,
			baseCls: 'cls-header',
			xtype: "Menu",
			itemId: "MenuPanel",
			menu: [
				{
					itemId: 'menuRequest',
					text: "Demande",
					menu: [
						{
							itemId: 'menuNewRequest',
							text: "Nouvelle"
						},
						{
							itemId: 'menuExcelImport',
							text: "Excel Import"
						},
						{
							itemId: 'menuExcel',
							text: "Excel Export"
						}											
					]
				},
				{	
					itemId: 'menuDisplay',
					text: "Affichage",
					menu: [
						{	
							itemId: 'menuStep',
							text: "Etape",
							menu: [
								{
									xtype: 'menucheckitem',
									itemId: 'Step1',
									text: "Demande",
									value: 1,
									checked: true
								},	
								{
									xtype: 'menucheckitem',
									itemId: 'Step2',
									text: "Validée",
									value: 2,
									checked: true
								},	
								{
									xtype: 'menucheckitem',
									itemId: 'Step3',
									text: "Commandée",
									value: 3,
									checked: true
								},	
								{
									xtype: 'menucheckitem',
									itemId: 'Step4',
									text: "Disponible",
									value: 4,
									checked: true
								},	
								{
									xtype: 'menucheckitem',
									itemId: 'Step5',
									text: "Installée",
									value: 5,
									checked: true
								},	
								{
									xtype: 'menucheckitem',
									itemId: 'Step6',
									text: "Clôturée",
									value: 6
								}										
							]
						},
						{	
							itemId: 'menuPrio',
							text: "Priorité",
							menu: [
								{
									xtype: 'menucheckitem',
									itemId: 'Prio0',
									text: "P0",
									value: 'P0',
									checked: true
								},	
								{
									xtype: 'menucheckitem',
									itemId: 'Prio1',
									text: "P1",
									value: 'P1',
									checked: true
								},	
								{
									xtype: 'menucheckitem',
									itemId: 'Prio2',
									text: "P2",
									value: 'P2',
									checked: true
								},	
								{
									xtype: 'menucheckitem',
									itemId: 'Step3',
									text: "P3",
									value: 'P3',
									checked: true
								}										
							]
						}											
					]
				}	
			]		
		},	
			{
				region: "center",			
				split:true,
				layout: "fit",
				items:[
					{
					xtype: "grid",
					itemId: "ListPrincipal",
					width: "100%",
					features: [
						{
							groupHeaderTpl: 'Département: {name}',
							ftype: 'groupingsummary'
						}
					],		
						tbar:[
							{
								xtype: "combo",
								itemId: "Year",
								padding: 4,
								fieldLabel: "Année",
								store: App.store.create({fields:["year"],data:[{year:"2015"},{year:"2016"},{year:"2017"}]}),
								displayField: "year",
								valueField: "year",
								editable: false
							}
						],
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
							},
							{
								flex: 2,
								text: "Validé le",
								dataIndex: "DateValidation",
								renderer: Ext.util.Format.dateRenderer('Y-m-d')
							},
							{
								flex: 1,
								text: "Priorité",
								dataIndex: "Priorite"
							},
							{
								flex: 1,
								text: "Etape",
								dataIndex: "Etape"
							},
							{
								flex: 1,
								text: "A faire",
								dataIndex: "UsageCollectif",
								renderer: function(value) {
									if (value==true) return ('<div style="background-color:red">&nbsp;</div>'); else return ('<div style="background-color:black">&nbsp;</div>');
								}
							},							
							{
								flex: 1,
								xtype: 'checkcolumn',
								text: "Spe",
								dataIndex: "CreditSpecifique",
								disabled: true
							},
							{
								flex: 1,
								xtype: 'checkcolumn',
								text: "Installé",
								dataIndex: "Installe",
								disabled: true
							},										
							{
								flex: 1,
								xtype: 'checkcolumn',
								text: "Cloturé",
								dataIndex: "Cloture",
								disabled: true
							}	
						],
						store: App.store.create('App.MyService.GenerateList',{
							groupField:'LibUnic',							
							listeners: {
								load: function(p){}
							}
						})						
					} 
					
				]
			}	
		]	
	});
