
EUSearchAjax = function(){
	
    var self                    = this;
    var container               = false;
    var itemTemplate            = false;
    var facetTemplate           = false;
    var filterTemplate          = false;

    var resultServerUrl         = 'http://europeana.eu/portal';

    
    //var searchUrl				= searchUrl ? searchUrl : 'http://test.portal2.eanadev.org/api/v2/search.json?wskey=api2demo';
	
    var searchUrl				= searchUrl ? searchUrl : 'http://localhost:3000/en/europeana/search.json';

	

		
	// Andy TODO delete
	var searchUrlWithoutResults = 'http://test.portal2.eanadev.org/portal/search.html';
	
    var defaultRows             = 6;
    var pagination              = false;
    var paginationData          = typeof defPaginationData != 'undefined' ? defPaginationData : {};
    
   
    var doSearch = function(startParam, query){
    	
    	console.log("doSearch()");
    	try{
	    	var url = buildUrl(startParam, query);
	
	    	console.log("doSearch(): url = " + url);
	
	        if(typeof url != 'undefined' && url.length){
	        	
	        	if(searchUrl.indexOf('file')==0){
					getFake();
	        	}
	        	else{
	        		showSpinner();
	                $.ajax({
	                    "url" : url,
	                    "type" : "GET",
	                    "crossDomain" : true,
	                    "dataType" : "script",
	                    "contentType" :	"application/x-www-form-urlencoded;charset=UTF-8"
	                });
	        	}
	
	        }
	        else{
	            self.q.addClass('error-border');
	        }
    	}
    	catch(e){
    		console.log(e);
    	}
    };

    
    // build search param from url-fragment hrefs.  @startParam set to 1 if not specified
    var buildUrl = function(startParam, query){

    	console.log("buildUrl() @startParam= " + startParam + ", @query = " + query);
    	
        var term = self.q.val();
        if (!term) {
            return '';
        }
        
        var url = '';
		var param = function(urlIn){
			return ((urlIn ? urlIn : url).indexOf('?')>-1) ? '&' : '?';
		};

		
		var rows = parseInt(self.resMenu1.getActive() ? self.resMenu1.getActive() : defaultRows);
    	
		url = query ? searchUrl + param(searchUrl) + query : searchUrl + param(searchUrl) + 'q=' + term;        	
    	url += "&profile=facets,params&callback=searchAjax.showRes";
    	
    	url += '&rows='  + rows;
    	url += '&start=' + (startParam ? startParam : 1);
    	url += '&page='  + (startParam ? Math.ceil(startParam / rows) : 1);
         
        
        // refinements & facets read from hidden inputs

        container.find('#facets input:checked').each(function(i, ob){
        	var urlFragment = $(ob).attr('value');
        	if(urlFragment.indexOf(':')>0){
        		urlFragment = urlFragment.split(':')[0] + ':' + '"' + encodeURI(urlFragment.split(':')[1] + '"');
        	}
        	url += param() + urlFragment;
        });        	

        
        /*
        if(self.config){
        	if(self.config.qf){
        		$.each(self.config.qf, function(i, ob){
        			
        			// console.log("Full ob = " + JSON.stringify(ob) + ", "  + ob.length);
        			console.log("append to url = " + JSON.stringify(ob));
        			
        			ob = ob.replace(/[\{\}]/g, '"');
//        			ob = ob.replace(/\}/g, '"');
        			
        			url += param() + 'qf=';
        			url += (ob.indexOf(' ')>-1) ? (ob.split(':')[0] + ':' + '"' + ob.split(':')[1] + '"') : ob;
        			
        			console.log('append to url: ' + url);
        		});
        	}
        }
		*/

		console.log('final search url: ' + url);

		return url;
    };

    
    var showRes = function(data){

    	console.log("showRes()");
    	
        // Append items
        var grid = container.find('.stories');
        grid.empty();

        // console.log("widget showRes(data), data = \n" + JSON.stringify(data));
        var start = data.params.start ? data.params.start : 1;

        // @richard - we need a start value.
        
        //alert("showRes() start = " + start + ", params = \n" + JSON.stringify(data.params));
        
        $(data.items).each(function(i, ob){
            var item = itemTemplate.clone();

            item.find('a').attr(
                'href', resultServerUrl + '/record' + ob.id + '.html?start=' + start + '&query='
            );

            item.find('a .ellipsis').prepend(
                document.createTextNode(ob.title)
            );

            item.find('.thumb-frame a').attr({
                "title": ob.title,
                "target" : "_new"
            });

            if(ob.edmPreview){
	            item.find('img').attr(
	                'src', ob.edmPreview[0]
	            );
            }
            
            grid.append(item);
        });


        // pagination
      
        paginationData = {"records":data.totalResults, "rows": data.params.rows, "start": start};
        
        pagination.setData(data.totalResults, data.params.rows, start);


        // result stats

        container.find('.first-vis-record').html(start);
        container.find('.last-vis-record') .html(start - 1 + data.itemsCount);
        container.find('.last-record')     .html(data.totalResults);


        // facets
    
        var cbCount  = 0;
        var selected = container.find('#facets input[type=checkbox]:checked').next('a');

        container.find('#facets>li:not(:first)').remove(); // remove all but the "Add Keyword" form.
        
        // write facet dom

        $(data.facets).each(function(i, ob){
        	
            var facet           = facetTemplate.clone();
            var facetOps        = facet.find('ul');
            var facetOpTemplate = facetOps.find('li:nth-child(1)');
                        
            facet.find('h3 a').html(capitalise(ob.name));
            
            facetOps.empty();
            $.each(ob.fields, function(i, field){
                
                var facetOp = facetOpTemplate.clone();

               // var urlFragment = "qf=" + ob.name + ":" + field.label;
                var urlFragment = "&facets[" + ob.name + "]=" + field.label;
                
                // 
                
                facetOp.find('h4 a').attr({
                    "href"  : urlFragment,
                    "title" : field.label
                });

                facetOp.find("input").attr({
                    "name"  : "cb-" + cbCount,
                    "id"    : "cb-" + cbCount,
                    "value" : urlFragment
                });

                facetOp.find('label').html(field.label).attr({
                    "for"   : "cb-" + cbCount,
                    "title" : field.label
                });

                facetOp.find('.fcount').html(' (' + field.count + ')');

                facetOps.append( facetOp );
                cbCount ++;
            });
            facet.append(facetOps);
            container.find('#facets').append(facet);
        });

        // facet actions 
        
        var refinements = container.find('#refine-search-form');
		
        container.find('#facets  a label').add(container.find('#facets h4 input')).click(function(e){
        	
            var cb = $(this);
            if(cb.attr("for")){
                cb = container.find('#facets #' + cb.attr("for"));
            }

            cb.prop('checked', !cb.prop('checked') );
            e.preventDefault();
            
            var href = cb.next('a').attr('href');
            
            console.log("read href: " + href);
            
            if(cb.prop('checked')){
            	$('<input type="hidden" name="qf" value="' + href + '"/>').appendTo(refinements);            	
            }
            else{
    			var toRemove =  refinements.find('input[value="' + href + '"]');
            	toRemove.remove();
            }
        	
            doSearch();
        });
        
        // facet collapsibility 
              
        container.find('#facets>li:not(:first)').each(function(i, ob){
        	ob = $(ob);
        	var heading = ob.find('h3 a');
			createCollapsibleSection(ob, function(){
	            return heading.parent().next('ul').first().find('a');   
	        },
	        heading);
        });

        // restore facet selection
    
        var opened = {};
        $(selected).each(function(i, ob){ 
            var object = container.find('a[href="' + $(ob).attr('href') + '"]');
            var opener = object.closest('ul').prev('h3').find('a');
            
            if(!opened[opener]){
                opened[opener] = true;
                // console.log("restore selected " + opener.html() );
                opener.click();
            }
            object.prev().prop('checked', true);
        });
        
        // open "Add Keyword"
        
        if(container.find('#refinements').css('display') == 'none'){
        	container.find('#facets li:first h3 a').click();
        }


    }; // end showRes

    
    var showSpinner = function(){
    	container.find('#overlay').show();
    	$('.search-widget-container').css('overflow-y', 'hidden');    	
    };
    
    var hideSpinner = function(){
    	container.find('#overlay').hide();
    	$('.search-widget-container').css('overflow-y', 'auto');
    };
    
    var capitalise = function(str){
    	return (str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase() ).replace(/_/g, ' ');
    };
    
	var createCollapsibleSection = function(ob, fnGetItems, heading){
        var accessibility =  new EuAccessibility(heading, fnGetItems);
        
        if(ob.hasClass('ugc-li')){
            ob.bind('keypress', accessibility.keyPress);
        }
        else{
            ob.Collapsible({
                "headingSelector" : "h3 a",
                "bodySelector"    : "ul",
                "keyHandler"      : accessibility
            });
        }
    };

    /*
    var setupEllipsis = function(){
        var ellipsisObjects = [];
        container.find('.ellipsis').each(
            function(i, ob){
                var fixed    = $(ob).find('.fixed');
                var html    = fixed.html();
                fixed.remove();
                ellipsisObjects[ellipsisObjects.length] = new Ellipsis(
                    $(ob),
                    {fixed:    '<span class="fixed">' + html + '</span>'},
                    function($ob){
                        var imgThumb = $(ob).parent().prev();
                        imgThumb.css('border-style', 'solid solid none');
                        imgThumb.css('border-width', '1px 1px medium');
                        $ob.css('visibility', 'visible');
                    }
                );                    
            }
        );

        $(window).euRsz(function(){
        	
            for(var i=0; i<ellipsisObjects.length; i++ ){
                ellipsisObjects[i].respond();
            }
        });
      
    };
    */
    
    var setupQuery = function(){
        self.q = container.find('#q');
      
        var submitCell          = container.find('.submit-cell');
        var submitCellButton    = container.find('button');
        var menuCell            = container.find('.menu-cell');
        var searchMenu          = container.find('#search-menu');

        // form size adjust
        submitCell.css("width", submitCellButton.outerWidth(true) + "px"); 
        menuCell.css("width", searchMenu.width() + "px");
        submitCellButton.css("border-left",    "solid 1px #4C7ECF");    // do this after the resize to stop 1px gap in FF

        // Disable forms and wire submission to ajax call
        
        
        container.find("form").submit(function() {
            doSearch();
            return false;
        });
        
        container.find("#refine-search-form").unbind('submit').submit(function() {
	        try{	
	        	var keyInput = $(this).find('#newKeyword');
	        	var keyword  = keyInput.val();
	        	
	        	keyInput.val('');
	        	if(keyword){
	        		keyInput.removeClass('error-border');    		
		     		$(this).append('<input type="hidden" name="qf" value="qf=' + keyword + '"/>');
	                doSearch();    
	        	}
	        	else{
	        		keyInput.addClass('error-border');
	        	}
	        }
	        catch(e){
	        	console.log(e);
	        }
            return false;
        });
    };

    var setupMenus = function(){
    	
        // result size 
        
    	var menuConfig = {
            "fn_init": function(self){
                self.setActive(paginationData.rows);
            },
            "fn_item":function(self, selected){
                doSearch();
            }
        };
    	
        self.resMenu1 = new EuMenu( container.find(".nav-top .eu-menu"),	menuConfig);
        self.resMenu2 = new EuMenu( container.find(".nav-bottom .eu-menu"),	menuConfig);

        self.resMenu1.init();
        self.resMenu2.init();

        // menu closing
        $(container).click( function(){
        	container.find('.eu-menu' ).removeClass("active");
        });
    };

    var setUpRefinements = function(){
        var addKeyword = container.find('#facets>li:first');
       	var heading = addKeyword.find("h3 a");
		createCollapsibleSection(addKeyword, function(){
    	        return heading.parent().next('form').find('input[type!="hidden"]');
	        },
	        heading);
		
		container.find('#refine-search-form > input').remove();
    };
    
    
    
    
    self.init = function(htmlData) {

        container = $('#content');
        container.append('<div id="overlay"></div>');
        $('#overlay').hide();
        
        itemTemplate       = container.find('.stories li:first');
        facetTemplate      = container.find('#facets li:nth-child(3)');
        facetTemplate      = $(
        		        
        '<li>' + 
          '<h3><a rel="nofollow" class="facet-section icon-arrow-6" href=""></a></h3>' + 
          '<ul style="display: none;">' + 
            '<li>' + 
              '<h4>' + 
                  '<input type="checkbox"><a><label></label></a><span class="fcount"></span>' + 
              '</h4>' + 
            '</li>' + 
          '</ul>' + 
        '</li>'
        ).appendTo('#facets');

        // TODO: remove filters
        filterTemplate     = container.find('#facets li:first');

        setupQuery();
        setupMenus();
        setUpRefinements(); // TODO

        pagination = new EuPagination($('.result-pagination'),
        	{
        		"ajax":true,
        		"fns":{
            		"fnFirst":function(e){
            			e.preventDefault();
            			
						console.log("fnFirst");

            			searchAjax.search(1);
            		},
					"fnPrevious":function(e){
						e.preventDefault();

            			console.log("fnPrevious");
            			self.options.data
						searchAjax.search(paginationData.start - paginationData.rows);
					},       			
            		"fnNext":function(e){
            			e.preventDefault();
            			
            			//console.log("fnNext -> call search with " + (paginationData.start + paginationData.rows)  );

            			searchAjax.search( parseInt(paginationData.start) + parseInt(paginationData.rows));
            		},
					"fnLast":function(e){
						e.preventDefault();

						console.log("fnLast");

						searchAjax.search(pagination.getMaxStart());
					},
            		"fnSubmit":function(val){
						val = parseInt(val);
            			var start = ((val-1) * paginationData.rows) + 1;
            			searchAjax.search( start );            				
			            return false;
					}
        		},
        		data: paginationData
        	}
        );

    };

    
    return {
        "init" : function(data){ self.init(data);},
        "search" : function(startParam){ 
        	doSearch(startParam); },
        "showRes" : function(data){ showRes(data); }
    };
};


var searchAjax = EUSearchAjax();
searchAjax.init();





