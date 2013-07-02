var EuPagination = function(cmpIn, maxPages){
    
    // conf
    var self       = this;
    self.cmp       = cmpIn;

    // dom 

    self.form      = null;
    self.jump      = null;
    
    self.maxPages  = maxPages ? maxPages : 0;
    
    // initialise to be called once html cmp is set
    self.init = function(){    	
        self.form         = self.cmp.find('form');
        self.jump         = self.cmp.find('#page');
        self.ofPages      = self.cmp.find('form .of-bracket');
        self.jump.bind('keypress', validateJumpToPage);
    };

    
    var validateJumpToPage = function(e){
    	
        if(e.ctrlKey || e.metaKey || e.keyCode == 9){
            // ctrl or cmd or tab
            return;
        }
        
        var $this        = $(this);
        var $jumpToPage  = $(this).parent();
        var key          = window.event ? e.keyCode : e.which;
        
        if([8, 46, 37, 38, 39, 40].indexOf(e.keyCode)>-1){
            /* delete, backspace, left, up, right, down */
            return true;
        }
        else if(e.keyCode == 13){
            /* return */
            var currVal = self.jump.val();
            return currVal.length > 0;
        }
        else if ( key < 48 || key > 57 ) {
            /* alphabet */
            return false;
        }
        else{
            /* number */
            
            var val = parseInt( $this.val() + String.fromCharCode(key) );
            
            if(typeof $this[0].selectionStart != 'undefined' && typeof $this[0].selectionEnd != 'undefined' && $this[0].selectionStart != $this[0].selectionEnd){
                val = parseInt(    $this.val().substr(0, $this[0].selectionStart -1)    + String.fromCharCode(key) + $this.val().substr($this[0].selectionEnd, $this.val().length )    );      
            }
            
            var overwrite;
            
            if(!val>0){
                overwrite = 1;
                val = 1;
            }
            else if(val > self.maxPages){
                overwrite = self.maxPages;
                val = self.maxPages;
            }
            if(overwrite){
                $(e.target).val(overwrite);
                e.preventDefault();
            }
            return true;
        }
    };
    
    self.init();

};
