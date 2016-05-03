
App.view.define('VImport', 
	{
		extend: 'Ext.window.Window',
		alias : 'widget.VImport',
		width: 500,
		height: 400,
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
				itemId: "btnTelechargerExcel",
				text: "Importer"
			}
		],
		defaults:{},
		items:[
		{
			xtype: "uploadfilemanager",
			border: false,
			itemId: "up",
			flex: 1,
			width: "100%",
			uploader: '/upload'
        }
		]
	});