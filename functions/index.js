
		var BANC_TEST = null;
		var BANC_TEST_1 = null;
		var BANC_TEST_2 = null;
		var BANC_TEST_3 = null;
		var BANC_TEST_4 = null;
		var BANC_TEST_5 = null;
		
		
		
		var Vcolor = [  '#FFC8A3' , '#61F554' , '#A3C6FF' ];
		
		// variable m�morisant l'arbre de stats des localhosts
		var myStore = null;
		
		// variable indicative du cycle de la derni�re rawdata dessin�e dans le tableau de rawdata
		var last_Cycle = null;
		
		// variable indicative du cycle de la derni�re rawdata dessin�e dans le tableau de rawdata
		//var compteur_Cycle = 0;
		
		// tableau de variables contenant l'index du graph courrament affich�
		var current_shown_graph_index = new Object();
		
		// variable contenant la <tr> courrante du tableau des alertes 
		var current_Alerts_TR = null;
		
		// tableau de parametres des onglets
		var tabParameters = new Array();
		
		
						
		// tableau des onglets
		var tabOngletsIds = ["Alerts", "RawData", "Global"];
		
		// variable indiquant l'onglet actif
		var activeTab = "Logs";
				
		
		// Tableaux (dynamiques) pr les zooms des networks
		var ChartNetwork = new Array();
		ChartNetwork[1] = new Array();
		ChartNetwork[2] = new Array();
		ChartNetwork[3] = new Array();
		ChartNetwork[4] = new Array();
		ChartNetwork[5] = new Array();
		ChartNetwork[6] = new Array();
		ChartNetwork[7] = new Array();
		
		var JsonObjNetwork = new Array();
		JsonObjNetwork[1] = new Array();
		JsonObjNetwork[2] = new Array();
		JsonObjNetwork[3] = new Array();
		JsonObjNetwork[4] = new Array();
		JsonObjNetwork[5] = new Array();
		JsonObjNetwork[6] = new Array();
		JsonObjNetwork[7] = new Array();
		
		var ChartLocalhost = new Array();
		ChartLocalhost[1] = new Array();
		ChartLocalhost[2] = new Array();
		ChartLocalhost[3] = new Array();
		ChartLocalhost[4] = new Array();
		ChartLocalhost[5] = new Array();
		ChartLocalhost[6] = new Array();
		ChartLocalhost[7] = new Array();
		
		var JsonObjLocalhost = new Array();
		JsonObjLocalhost[1] = new Array();
		JsonObjLocalhost[2] = new Array();
		JsonObjLocalhost[3] = new Array();
		JsonObjLocalhost[4] = new Array();
		JsonObjLocalhost[5] = new Array();
		JsonObjLocalhost[6] = new Array();
		JsonObjLocalhost[7] = new Array();
		
		var Chart1 = new Array();
		var Chart2 = new Array();
		var Chart3 = new Array();
		var Chart4 = new Array();
		var Chart5 = new Array();
		var JsonObj1 = new Array();
		var JsonObj2 = new Array();
		var JsonObj3 = new Array();
		var JsonObj4 = new Array();
		var JsonObj5 = new Array();
		
		
		// Tableaux (dynamiques) pr les zooms des hosts
		var Chart12 = new Array();
		var Chart13 = new Array();
		var Chart14 = new Array();
		var JsonObj12 = new Array();
		var JsonObj13 = new Array();
		var JsonObj14 = new Array();
		var MT;
		
		
		var serverWhoIsList = new Object();
		serverWhoIsList = {"items":[{"server": ""},
			{"server": "whois.apnic.net"},
			{"server": "whois.afrinic.net"},
			{"server": "whois.arin.net"},
			{"server": "whois.lacnic.net"},
			{"server": "whois.ripe.net"},
			{"server": "whois.cymru.com"},
			{"server": "whois.adamsnames.tc"},
			{"server": "whois.aero"},
			{"server": "whois.afilias.info"},
			{"server": "whois.amnic.net"},
			{"server": "whois.aunic.net"},
			{"server": "whois.ausregistry.net.au"},
			{"server": "whois.belizenic.bz"},
			{"server": "whois.centralnic.net"},
			{"server": "whois.cira.ca"},
			{"server": "whois.cnnic.net.cn"},
			{"server": "whois.dk-hostmaster.dk"},
			{"server": "whois.dns.be"},
			{"server": "whois.dns.lu"},
			{"server": "whois.domain.kg"},
			{"server": "whois.domainregistry.ie"},
			{"server": "whois.domreg.lt"},
			{"server": "whois.educause.net"},
			{"server": "whois.edu.cn"},
			{"server": "whois.eenet.ee"},
			{"server": "whois.eu"},
			{"server": "whois.eu.org"},
			{"server": "whois.ficora.fi"},
			{"server": "whois.hkdnr.net.hk"},
			{"server": "whois.iana.org"},
			{"server": "whois.idnic.net.id"},
			{"server": "whois.internic.net"},
			{"server": "whois.isles.net"},
			{"server": "whois.isoc.org.il"},
			{"server": "whois.krnic.net"},
			{"server": "whois.museum"},
			{"server": "whois.mynic.net.my"},
			{"server": "whois.na-nic.com.na"},
			{"server": "whois.ncst.ernet.in"},
			{"server": "whois.neulevel.biz"},
			{"server": "whois.nic.ac"},
			{"server": "whois.nic.ag"},
			{"server": "whois.nic.as"},
			{"server": "whois.nic.at"},
			{"server": "whois.nic.br"},
			{"server": "whois.nic.cc"},
			{"server": "whois.nic.cd"},
			{"server": "whois.nic.ch"},
			{"server": "whois.nic.ck"},
			{"server": "whois.nic.cl"},
			{"server": "whois.nic.coop"},
			{"server": "whois.nic.cx"},
			{"server": "whois.nic.cz"},
			{"server": "whois.nic.do"},
			{"server": "whois.nic.fr"},
			{"server": "whois.nic.gov"},
			{"server": "whois.nic.hu"},
			{"server": "whois.nic.ir"},
			{"server": "whois.nic.kz"},
			{"server": "whois.nic.la"},
			{"server": "whois.nic.li"},
			{"server": "whois.nic.lk"},
			{"server": "whois.nic.lv"},
			{"server": "whois.nic.mil"},
			{"server": "whois.nic.mm"},
			{"server": "whois.nic.mx"},
			{"server": "whois.nic.name"},
			{"server": "whois.offshore.ai"},
			{"server": "whois.registry.hm"},
			{"server": "whois.ripe.net"},
			{"server": "whois.uaenic.ae"},
			{"server": "whois.usp.ac.fj"},
		]};
		
		
		
		//var df = dojox.lang.functional;
		var TabIP=  new Array();
		var TabNAME=  new Array();
		var TabCOUNTRY=  new Array();
		

		
		var parameters="";
		//var dataPage="&page=1";
		var lastScrollTop=0;
		var lastDay=null;
		var lastHour=null;
		//var mouseDown = 0;
		var validKey = null;
		var lastLogEntry="";
		var JsonName = "";
		var NbCPH = 0;
		var dRDTD = false;
		var GeoIPASNum = "disabled";
		var GeoIP = "disabled";
		var isDBMS = false;
		var setTOAnim = null;
		var setTOClign = null;
		var setTOResolv = null;
		var tabRect = null;
		var decalageHoraire = 0;
		var lastAlertIndex = null;
		
		var svgNS = "http://www.w3.org/2000/svg";
		var xlinkNS = "http://www.w3.org/1999/xlink";
		
		
		var colors = new Array();
		colors[2] = "rgb(254, 254, 254)";
		
		//definitions des onglet et div actifs au demarrage (logs)
		var AncienOnglet = 'Logs';
		var AncienneDiv = 'DivLogs';
		
		
		// compteur servant au bipping de l'onglet plus
		var compteur=0;
		var pending=0;
		
		// compteur de (re)chargement (pr serveur temporairement injoignable)
		var reloadCompt=null;
		var retryCompt=null;
		
		// variables de resolution de l'AS
		var rASTO = null;
		var waitingForResolvingAS = false;
				
		var ESSS = 0;
		var ESSSS = 0;
		
		var logAutoRefreshTO = null;
		
		var jsonLocalhosts = {  "items" : [ ] };
		
		// variables de positions des champs dans les tableaux rawdata
		var cyc_INDEX = 0;
		var ipl_INDEX = 1;
		var d_INDEX = 2;
		var ipo_INDEX = 3;
		var c_INDEX = 4;
		var asn_INDEX = 5;
		var p_INDEX = 6;
		var pl_INDEX = 7;
		var po_INDEX = 8;
		var flg_INDEX = 9;
		var itr_INDEX = 10;
		var otr_INDEX = 11;
		var ipk_INDEX = 12;
		var opk_INDEX = 13;
		var fst_INDEX = 13;
		var lst_INDEX = 14;
		var dur_INDEX = 15;
		var application_id_INDEX = 16;
		var num_id_flow_INDEX = 17;
		
	
		// index de la derni�re alerte connue
		var lastAlertIdx = null;
		
		// compteur de "startup" de la tab container ( lancer le click on tree au 4eme startup qui est le dernier)
		var startupCount = 0;
		
		askWhere = "/znets/";/*"/hell/";*/
		
		divSizePercent = "80%";
		
	
	