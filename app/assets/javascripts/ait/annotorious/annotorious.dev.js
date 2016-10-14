function $JSCompiler_alias_THROW$$($jscomp_throw_param$$) {
  throw $jscomp_throw_param$$;
}
var $JSCompiler_alias_VOID$$ = void 0, $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1;
function $JSCompiler_emptyFn$$() {
  return function() {
  }
}
function $JSCompiler_get$$($JSCompiler_get_name$$) {
  return function() {
    return this[$JSCompiler_get_name$$]
  }
}
function $JSCompiler_returnArg$$($JSCompiler_returnArg_value$$) {
  return function() {
    return $JSCompiler_returnArg_value$$
  }
}
var $JSCompiler_prototypeAlias$$, $goog$global$$ = this;
function $goog$exportPath_$$($name$$57$$, $opt_object$$) {
  var $parts$$ = $name$$57$$.split("."), $cur$$ = $goog$global$$;
  !($parts$$[0] in $cur$$) && $cur$$.execScript && $cur$$.execScript("var " + $parts$$[0]);
  for(var $part$$;$parts$$.length && ($part$$ = $parts$$.shift());) {
    !$parts$$.length && $goog$isDef$$($opt_object$$) ? $cur$$[$part$$] = $opt_object$$ : $cur$$ = $cur$$[$part$$] ? $cur$$[$part$$] : $cur$$[$part$$] = {}
  }
}
function $goog$nullFunction$$() {
}
function $goog$addSingletonGetter$$($ctor$$) {
  $ctor$$.$getInstance$ = function $$ctor$$$$getInstance$$() {
    return $ctor$$.$instance_$ ? $ctor$$.$instance_$ : $ctor$$.$instance_$ = new $ctor$$
  }
}
function $goog$typeOf$$($value$$39$$) {
  var $s$$2$$ = typeof $value$$39$$;
  if("object" == $s$$2$$) {
    if($value$$39$$) {
      if($value$$39$$ instanceof Array) {
        return"array"
      }
      if($value$$39$$ instanceof Object) {
        return $s$$2$$
      }
      var $className$$1$$ = Object.prototype.toString.call($value$$39$$);
      if("[object Window]" == $className$$1$$) {
        return"object"
      }
      if("[object Array]" == $className$$1$$ || "number" == typeof $value$$39$$.length && "undefined" != typeof $value$$39$$.splice && "undefined" != typeof $value$$39$$.propertyIsEnumerable && !$value$$39$$.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == $className$$1$$ || "undefined" != typeof $value$$39$$.call && "undefined" != typeof $value$$39$$.propertyIsEnumerable && !$value$$39$$.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == $s$$2$$ && "undefined" == typeof $value$$39$$.call) {
      return"object"
    }
  }
  return $s$$2$$
}
function $goog$isDef$$($val$$) {
  return $val$$ !== $JSCompiler_alias_VOID$$
}
function $goog$isArray$$($val$$3$$) {
  return"array" == $goog$typeOf$$($val$$3$$)
}
function $goog$isArrayLike$$($val$$4$$) {
  var $type$$50$$ = $goog$typeOf$$($val$$4$$);
  return"array" == $type$$50$$ || "object" == $type$$50$$ && "number" == typeof $val$$4$$.length
}
function $goog$isString$$($val$$6$$) {
  return"string" == typeof $val$$6$$
}
function $goog$isFunction$$($val$$9$$) {
  return"function" == $goog$typeOf$$($val$$9$$)
}
function $goog$isObject$$($val$$10$$) {
  var $type$$51$$ = typeof $val$$10$$;
  return"object" == $type$$51$$ && $val$$10$$ != $JSCompiler_alias_NULL$$ || "function" == $type$$51$$
}
function $goog$getUid$$($obj$$17$$) {
  return $obj$$17$$[$goog$UID_PROPERTY_$$] || ($obj$$17$$[$goog$UID_PROPERTY_$$] = ++$goog$uidCounter_$$)
}
var $goog$UID_PROPERTY_$$ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), $goog$uidCounter_$$ = 0;
function $goog$bindNative_$$($fn$$, $selfObj$$1$$, $var_args$$24$$) {
  return $fn$$.call.apply($fn$$.bind, arguments)
}
function $goog$bindJs_$$($fn$$1$$, $selfObj$$2$$, $var_args$$25$$) {
  $fn$$1$$ || $JSCompiler_alias_THROW$$(Error());
  if(2 < arguments.length) {
    var $boundArgs$$ = Array.prototype.slice.call(arguments, 2);
    return function() {
      var $newArgs$$ = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply($newArgs$$, $boundArgs$$);
      return $fn$$1$$.apply($selfObj$$2$$, $newArgs$$)
    }
  }
  return function() {
    return $fn$$1$$.apply($selfObj$$2$$, arguments)
  }
}
function $goog$bind$$($fn$$2$$, $selfObj$$3$$, $var_args$$26$$) {
  $goog$bind$$ = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? $goog$bindNative_$$ : $goog$bindJs_$$;
  return $goog$bind$$.apply($JSCompiler_alias_NULL$$, arguments)
}
function $goog$partial$$($fn$$3$$, $var_args$$27$$) {
  var $args$$ = Array.prototype.slice.call(arguments, 1);
  return function() {
    var $newArgs$$1$$ = Array.prototype.slice.call(arguments);
    $newArgs$$1$$.unshift.apply($newArgs$$1$$, $args$$);
    return $fn$$3$$.apply(this, $newArgs$$1$$)
  }
}
var $goog$now$$ = Date.now || function() {
  return+new Date
};
function $goog$inherits$$($childCtor$$, $parentCtor$$) {
  function $tempCtor$$() {
  }
  $tempCtor$$.prototype = $parentCtor$$.prototype;
  $childCtor$$.$superClass_$ = $parentCtor$$.prototype;
  $childCtor$$.prototype = new $tempCtor$$;
  $childCtor$$.prototype.constructor = $childCtor$$
}
;function $goog$string$trim$$($str$$25$$) {
  return $str$$25$$.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
}
function $goog$string$htmlEscape$$($str$$31$$) {
  if(!$goog$string$allRe_$$.test($str$$31$$)) {
    return $str$$31$$
  }
  -1 != $str$$31$$.indexOf("&") && ($str$$31$$ = $str$$31$$.replace($goog$string$amperRe_$$, "&amp;"));
  -1 != $str$$31$$.indexOf("<") && ($str$$31$$ = $str$$31$$.replace($goog$string$ltRe_$$, "&lt;"));
  -1 != $str$$31$$.indexOf(">") && ($str$$31$$ = $str$$31$$.replace($goog$string$gtRe_$$, "&gt;"));
  -1 != $str$$31$$.indexOf('"') && ($str$$31$$ = $str$$31$$.replace($goog$string$quotRe_$$, "&quot;"));
  return $str$$31$$
}
var $goog$string$amperRe_$$ = /&/g, $goog$string$ltRe_$$ = /</g, $goog$string$gtRe_$$ = />/g, $goog$string$quotRe_$$ = /\"/g, $goog$string$allRe_$$ = /[&<>\"]/;
function $goog$string$toCamelCase$$($str$$42$$) {
  return String($str$$42$$).replace(/\-([a-z])/g, function($all$$, $match$$) {
    return $match$$.toUpperCase()
  })
}
;var $goog$array$ARRAY_PROTOTYPE_$$ = Array.prototype, $goog$array$indexOf$$ = $goog$array$ARRAY_PROTOTYPE_$$.indexOf ? function($arr$$10$$, $obj$$21$$, $opt_fromIndex$$6$$) {
  return $goog$array$ARRAY_PROTOTYPE_$$.indexOf.call($arr$$10$$, $obj$$21$$, $opt_fromIndex$$6$$)
} : function($arr$$11$$, $obj$$22$$, $fromIndex_i$$12_opt_fromIndex$$7$$) {
  $fromIndex_i$$12_opt_fromIndex$$7$$ = $fromIndex_i$$12_opt_fromIndex$$7$$ == $JSCompiler_alias_NULL$$ ? 0 : 0 > $fromIndex_i$$12_opt_fromIndex$$7$$ ? Math.max(0, $arr$$11$$.length + $fromIndex_i$$12_opt_fromIndex$$7$$) : $fromIndex_i$$12_opt_fromIndex$$7$$;
  if($goog$isString$$($arr$$11$$)) {
    return!$goog$isString$$($obj$$22$$) || 1 != $obj$$22$$.length ? -1 : $arr$$11$$.indexOf($obj$$22$$, $fromIndex_i$$12_opt_fromIndex$$7$$)
  }
  for(;$fromIndex_i$$12_opt_fromIndex$$7$$ < $arr$$11$$.length;$fromIndex_i$$12_opt_fromIndex$$7$$++) {
    if($fromIndex_i$$12_opt_fromIndex$$7$$ in $arr$$11$$ && $arr$$11$$[$fromIndex_i$$12_opt_fromIndex$$7$$] === $obj$$22$$) {
      return $fromIndex_i$$12_opt_fromIndex$$7$$
    }
  }
  return-1
}, $goog$array$forEach$$ = $goog$array$ARRAY_PROTOTYPE_$$.forEach ? function($arr$$14$$, $f$$, $opt_obj$$1$$) {
  $goog$array$ARRAY_PROTOTYPE_$$.forEach.call($arr$$14$$, $f$$, $opt_obj$$1$$)
} : function($arr$$15$$, $f$$1$$, $opt_obj$$2$$) {
  for(var $l$$2$$ = $arr$$15$$.length, $arr2$$ = $goog$isString$$($arr$$15$$) ? $arr$$15$$.split("") : $arr$$15$$, $i$$14$$ = 0;$i$$14$$ < $l$$2$$;$i$$14$$++) {
    $i$$14$$ in $arr2$$ && $f$$1$$.call($opt_obj$$2$$, $arr2$$[$i$$14$$], $i$$14$$, $arr$$15$$)
  }
}, $goog$array$filter$$ = $goog$array$ARRAY_PROTOTYPE_$$.filter ? function($arr$$17$$, $f$$3$$, $opt_obj$$4$$) {
  return $goog$array$ARRAY_PROTOTYPE_$$.filter.call($arr$$17$$, $f$$3$$, $opt_obj$$4$$)
} : function($arr$$18$$, $f$$4$$, $opt_obj$$5$$) {
  for(var $l$$4$$ = $arr$$18$$.length, $res$$ = [], $resLength$$ = 0, $arr2$$2$$ = $goog$isString$$($arr$$18$$) ? $arr$$18$$.split("") : $arr$$18$$, $i$$16$$ = 0;$i$$16$$ < $l$$4$$;$i$$16$$++) {
    if($i$$16$$ in $arr2$$2$$) {
      var $val$$11$$ = $arr2$$2$$[$i$$16$$];
      $f$$4$$.call($opt_obj$$5$$, $val$$11$$, $i$$16$$, $arr$$18$$) && ($res$$[$resLength$$++] = $val$$11$$)
    }
  }
  return $res$$
}, $goog$array$map$$ = $goog$array$ARRAY_PROTOTYPE_$$.map ? function($arr$$19$$, $f$$5$$, $opt_obj$$6$$) {
  return $goog$array$ARRAY_PROTOTYPE_$$.map.call($arr$$19$$, $f$$5$$, $opt_obj$$6$$)
} : function($arr$$20$$, $f$$6$$, $opt_obj$$7$$) {
  for(var $l$$5$$ = $arr$$20$$.length, $res$$1$$ = Array($l$$5$$), $arr2$$3$$ = $goog$isString$$($arr$$20$$) ? $arr$$20$$.split("") : $arr$$20$$, $i$$17$$ = 0;$i$$17$$ < $l$$5$$;$i$$17$$++) {
    $i$$17$$ in $arr2$$3$$ && ($res$$1$$[$i$$17$$] = $f$$6$$.call($opt_obj$$7$$, $arr2$$3$$[$i$$17$$], $i$$17$$, $arr$$20$$))
  }
  return $res$$1$$
}, $goog$array$every$$ = $goog$array$ARRAY_PROTOTYPE_$$.every ? function($arr$$25$$, $f$$11$$, $opt_obj$$12$$) {
  return $goog$array$ARRAY_PROTOTYPE_$$.every.call($arr$$25$$, $f$$11$$, $opt_obj$$12$$)
} : function($arr$$26$$, $f$$12$$, $opt_obj$$13$$) {
  for(var $l$$7$$ = $arr$$26$$.length, $arr2$$5$$ = $goog$isString$$($arr$$26$$) ? $arr$$26$$.split("") : $arr$$26$$, $i$$19$$ = 0;$i$$19$$ < $l$$7$$;$i$$19$$++) {
    if($i$$19$$ in $arr2$$5$$ && !$f$$12$$.call($opt_obj$$13$$, $arr2$$5$$[$i$$19$$], $i$$19$$, $arr$$26$$)) {
      return $JSCompiler_alias_FALSE$$
    }
  }
  return $JSCompiler_alias_TRUE$$
};
function $goog$array$find$$($arr$$27$$, $f$$13$$) {
  var $i$$20_l$$inline_62$$;
  a: {
    $i$$20_l$$inline_62$$ = $arr$$27$$.length;
    for(var $arr2$$inline_63$$ = $goog$isString$$($arr$$27$$) ? $arr$$27$$.split("") : $arr$$27$$, $i$$inline_64$$ = 0;$i$$inline_64$$ < $i$$20_l$$inline_62$$;$i$$inline_64$$++) {
      if($i$$inline_64$$ in $arr2$$inline_63$$ && $f$$13$$.call($JSCompiler_alias_VOID$$, $arr2$$inline_63$$[$i$$inline_64$$], $i$$inline_64$$, $arr$$27$$)) {
        $i$$20_l$$inline_62$$ = $i$$inline_64$$;
        break a
      }
    }
    $i$$20_l$$inline_62$$ = -1
  }
  return 0 > $i$$20_l$$inline_62$$ ? $JSCompiler_alias_NULL$$ : $goog$isString$$($arr$$27$$) ? $arr$$27$$.charAt($i$$20_l$$inline_62$$) : $arr$$27$$[$i$$20_l$$inline_62$$]
}
function $goog$array$contains$$($arr$$31$$, $obj$$25$$) {
  return 0 <= $goog$array$indexOf$$($arr$$31$$, $obj$$25$$)
}
function $goog$array$remove$$($arr$$38$$, $obj$$29$$) {
  var $i$$26$$ = $goog$array$indexOf$$($arr$$38$$, $obj$$29$$);
  0 <= $i$$26$$ && $goog$array$ARRAY_PROTOTYPE_$$.splice.call($arr$$38$$, $i$$26$$, 1)
}
function $goog$array$toArray$$($object$$2$$) {
  var $length$$15$$ = $object$$2$$.length;
  if(0 < $length$$15$$) {
    for(var $rv$$3$$ = Array($length$$15$$), $i$$29$$ = 0;$i$$29$$ < $length$$15$$;$i$$29$$++) {
      $rv$$3$$[$i$$29$$] = $object$$2$$[$i$$29$$]
    }
    return $rv$$3$$
  }
  return[]
}
function $goog$array$extend$$($arr1$$, $var_args$$41$$) {
  for(var $i$$30$$ = 1;$i$$30$$ < arguments.length;$i$$30$$++) {
    var $arr2$$8$$ = arguments[$i$$30$$], $isArrayLike$$;
    if($goog$isArray$$($arr2$$8$$) || ($isArrayLike$$ = $goog$isArrayLike$$($arr2$$8$$)) && $arr2$$8$$.hasOwnProperty("callee")) {
      $arr1$$.push.apply($arr1$$, $arr2$$8$$)
    }else {
      if($isArrayLike$$) {
        for(var $len1$$ = $arr1$$.length, $len2$$ = $arr2$$8$$.length, $j$$1$$ = 0;$j$$1$$ < $len2$$;$j$$1$$++) {
          $arr1$$[$len1$$ + $j$$1$$] = $arr2$$8$$[$j$$1$$]
        }
      }else {
        $arr1$$.push($arr2$$8$$)
      }
    }
  }
}
function $goog$array$slice$$($arr$$42$$, $start$$5$$, $opt_end$$13$$) {
  return 2 >= arguments.length ? $goog$array$ARRAY_PROTOTYPE_$$.slice.call($arr$$42$$, $start$$5$$) : $goog$array$ARRAY_PROTOTYPE_$$.slice.call($arr$$42$$, $start$$5$$, $opt_end$$13$$)
}
function $goog$array$defaultCompare$$($a$$3$$, $b$$2$$) {
  return $a$$3$$ > $b$$2$$ ? 1 : $a$$3$$ < $b$$2$$ ? -1 : 0
}
;var $goog$userAgent$detectedOpera_$$, $goog$userAgent$detectedIe_$$, $goog$userAgent$detectedWebkit_$$, $goog$userAgent$detectedGecko_$$, $goog$userAgent$detectedMac_$$;
function $goog$userAgent$getUserAgentString$$() {
  return $goog$global$$.navigator ? $goog$global$$.navigator.userAgent : $JSCompiler_alias_NULL$$
}
function $goog$userAgent$getNavigator$$() {
  return $goog$global$$.navigator
}
$goog$userAgent$detectedGecko_$$ = $goog$userAgent$detectedWebkit_$$ = $goog$userAgent$detectedIe_$$ = $goog$userAgent$detectedOpera_$$ = $JSCompiler_alias_FALSE$$;
var $ua$$inline_69$$;
if($ua$$inline_69$$ = $goog$userAgent$getUserAgentString$$()) {
  var $navigator$$inline_70$$ = $goog$userAgent$getNavigator$$();
  $goog$userAgent$detectedOpera_$$ = 0 == $ua$$inline_69$$.indexOf("Opera");
  $goog$userAgent$detectedIe_$$ = !$goog$userAgent$detectedOpera_$$ && -1 != $ua$$inline_69$$.indexOf("MSIE");
  $goog$userAgent$detectedWebkit_$$ = !$goog$userAgent$detectedOpera_$$ && -1 != $ua$$inline_69$$.indexOf("WebKit");
  $goog$userAgent$detectedGecko_$$ = !$goog$userAgent$detectedOpera_$$ && !$goog$userAgent$detectedWebkit_$$ && "Gecko" == $navigator$$inline_70$$.product
}
var $goog$userAgent$OPERA$$ = $goog$userAgent$detectedOpera_$$, $goog$userAgent$IE$$ = $goog$userAgent$detectedIe_$$, $goog$userAgent$GECKO$$ = $goog$userAgent$detectedGecko_$$, $goog$userAgent$WEBKIT$$ = $goog$userAgent$detectedWebkit_$$, $navigator$$inline_72$$ = $goog$userAgent$getNavigator$$();
$goog$userAgent$detectedMac_$$ = -1 != ($navigator$$inline_72$$ && $navigator$$inline_72$$.platform || "").indexOf("Mac");
var $goog$userAgent$X11$$ = !!$goog$userAgent$getNavigator$$() && -1 != ($goog$userAgent$getNavigator$$().appVersion || "").indexOf("X11"), $goog$userAgent$VERSION$$;
a: {
  var $version$$inline_75$$ = "", $re$$inline_76$$;
  if($goog$userAgent$OPERA$$ && $goog$global$$.opera) {
    var $operaVersion$$inline_77$$ = $goog$global$$.opera.version, $version$$inline_75$$ = "function" == typeof $operaVersion$$inline_77$$ ? $operaVersion$$inline_77$$() : $operaVersion$$inline_77$$
  }else {
    if($goog$userAgent$GECKO$$ ? $re$$inline_76$$ = /rv\:([^\);]+)(\)|;)/ : $goog$userAgent$IE$$ ? $re$$inline_76$$ = /MSIE\s+([^\);]+)(\)|;)/ : $goog$userAgent$WEBKIT$$ && ($re$$inline_76$$ = /WebKit\/(\S+)/), $re$$inline_76$$) {
      var $arr$$inline_78$$ = $re$$inline_76$$.exec($goog$userAgent$getUserAgentString$$()), $version$$inline_75$$ = $arr$$inline_78$$ ? $arr$$inline_78$$[1] : ""
    }
  }
  if($goog$userAgent$IE$$) {
    var $docMode$$inline_79$$, $doc$$inline_794$$ = $goog$global$$.document;
    $docMode$$inline_79$$ = $doc$$inline_794$$ ? $doc$$inline_794$$.documentMode : $JSCompiler_alias_VOID$$;
    if($docMode$$inline_79$$ > parseFloat($version$$inline_75$$)) {
      $goog$userAgent$VERSION$$ = String($docMode$$inline_79$$);
      break a
    }
  }
  $goog$userAgent$VERSION$$ = $version$$inline_75$$
}
var $goog$userAgent$isVersionCache_$$ = {};
function $goog$userAgent$isVersion$$($version$$8$$) {
  var $JSCompiler_temp$$53_order$$inline_83$$;
  if(!($JSCompiler_temp$$53_order$$inline_83$$ = $goog$userAgent$isVersionCache_$$[$version$$8$$])) {
    $JSCompiler_temp$$53_order$$inline_83$$ = 0;
    for(var $v1Subs$$inline_84$$ = $goog$string$trim$$(String($goog$userAgent$VERSION$$)).split("."), $v2Subs$$inline_85$$ = $goog$string$trim$$(String($version$$8$$)).split("."), $subCount$$inline_86$$ = Math.max($v1Subs$$inline_84$$.length, $v2Subs$$inline_85$$.length), $subIdx$$inline_87$$ = 0;0 == $JSCompiler_temp$$53_order$$inline_83$$ && $subIdx$$inline_87$$ < $subCount$$inline_86$$;$subIdx$$inline_87$$++) {
      var $v1Sub$$inline_88$$ = $v1Subs$$inline_84$$[$subIdx$$inline_87$$] || "", $v2Sub$$inline_89$$ = $v2Subs$$inline_85$$[$subIdx$$inline_87$$] || "", $v1CompParser$$inline_90$$ = RegExp("(\\d*)(\\D*)", "g"), $v2CompParser$$inline_91$$ = RegExp("(\\d*)(\\D*)", "g");
      do {
        var $v1Comp$$inline_92$$ = $v1CompParser$$inline_90$$.exec($v1Sub$$inline_88$$) || ["", "", ""], $v2Comp$$inline_93$$ = $v2CompParser$$inline_91$$.exec($v2Sub$$inline_89$$) || ["", "", ""];
        if(0 == $v1Comp$$inline_92$$[0].length && 0 == $v2Comp$$inline_93$$[0].length) {
          break
        }
        $JSCompiler_temp$$53_order$$inline_83$$ = ((0 == $v1Comp$$inline_92$$[1].length ? 0 : parseInt($v1Comp$$inline_92$$[1], 10)) < (0 == $v2Comp$$inline_93$$[1].length ? 0 : parseInt($v2Comp$$inline_93$$[1], 10)) ? -1 : (0 == $v1Comp$$inline_92$$[1].length ? 0 : parseInt($v1Comp$$inline_92$$[1], 10)) > (0 == $v2Comp$$inline_93$$[1].length ? 0 : parseInt($v2Comp$$inline_93$$[1], 10)) ? 1 : 0) || ((0 == $v1Comp$$inline_92$$[2].length) < (0 == $v2Comp$$inline_93$$[2].length) ? -1 : (0 == $v1Comp$$inline_92$$[2].length) >
        (0 == $v2Comp$$inline_93$$[2].length) ? 1 : 0) || ($v1Comp$$inline_92$$[2] < $v2Comp$$inline_93$$[2] ? -1 : $v1Comp$$inline_92$$[2] > $v2Comp$$inline_93$$[2] ? 1 : 0)
      }while(0 == $JSCompiler_temp$$53_order$$inline_83$$)
    }
    $JSCompiler_temp$$53_order$$inline_83$$ = $goog$userAgent$isVersionCache_$$[$version$$8$$] = 0 <= $JSCompiler_temp$$53_order$$inline_83$$
  }
  return $JSCompiler_temp$$53_order$$inline_83$$
}
var $goog$userAgent$isDocumentModeCache_$$ = {};
function $goog$userAgent$isDocumentMode$$($documentMode$$) {
  return $goog$userAgent$isDocumentModeCache_$$[$documentMode$$] || ($goog$userAgent$isDocumentModeCache_$$[$documentMode$$] = $goog$userAgent$IE$$ && !!document.documentMode && document.documentMode >= $documentMode$$)
}
;var $goog$dom$defaultDomHelper_$$, $goog$dom$BrowserFeature$CAN_ADD_NAME_OR_TYPE_ATTRIBUTES$$ = !$goog$userAgent$IE$$ || $goog$userAgent$isDocumentMode$$(9);
!$goog$userAgent$GECKO$$ && !$goog$userAgent$IE$$ || $goog$userAgent$IE$$ && $goog$userAgent$isDocumentMode$$(9) || $goog$userAgent$GECKO$$ && $goog$userAgent$isVersion$$("1.9.1");
$goog$userAgent$IE$$ && $goog$userAgent$isVersion$$("9");
var $goog$dom$BrowserFeature$CAN_USE_PARENT_ELEMENT_PROPERTY$$ = $goog$userAgent$IE$$ || $goog$userAgent$OPERA$$ || $goog$userAgent$WEBKIT$$;
function $goog$dom$classes$get$$($className$$4_element$$7$$) {
  $className$$4_element$$7$$ = $className$$4_element$$7$$.className;
  return $goog$isString$$($className$$4_element$$7$$) && $className$$4_element$$7$$.match(/\S+/g) || []
}
function $goog$dom$classes$add$$($element$$8$$, $var_args$$45$$) {
  var $classes$$ = $goog$dom$classes$get$$($element$$8$$), $args$$3$$ = $goog$array$slice$$(arguments, 1), $expectedCount$$ = $classes$$.length + $args$$3$$.length;
  $goog$dom$classes$add_$$($classes$$, $args$$3$$);
  $element$$8$$.className = $classes$$.join(" ");
  return $classes$$.length == $expectedCount$$
}
function $goog$dom$classes$remove$$($element$$9$$, $var_args$$46$$) {
  var $classes$$1$$ = $goog$dom$classes$get$$($element$$9$$), $args$$4$$ = $goog$array$slice$$(arguments, 1), $newClasses$$ = $goog$dom$classes$getDifference_$$($classes$$1$$, $args$$4$$);
  $element$$9$$.className = $newClasses$$.join(" ");
  return $newClasses$$.length == $classes$$1$$.length - $args$$4$$.length
}
function $goog$dom$classes$add_$$($classes$$2$$, $args$$5$$) {
  for(var $i$$40$$ = 0;$i$$40$$ < $args$$5$$.length;$i$$40$$++) {
    $goog$array$contains$$($classes$$2$$, $args$$5$$[$i$$40$$]) || $classes$$2$$.push($args$$5$$[$i$$40$$])
  }
}
function $goog$dom$classes$getDifference_$$($arr1$$4$$, $arr2$$12$$) {
  return $goog$array$filter$$($arr1$$4$$, function($item$$) {
    return!$goog$array$contains$$($arr2$$12$$, $item$$)
  })
}
function $goog$dom$classes$addRemove$$($element$$11$$, $classesToRemove$$, $classesToAdd$$) {
  var $classes$$4$$ = $goog$dom$classes$get$$($element$$11$$);
  $goog$isString$$($classesToRemove$$) ? $goog$array$remove$$($classes$$4$$, $classesToRemove$$) : $goog$isArray$$($classesToRemove$$) && ($classes$$4$$ = $goog$dom$classes$getDifference_$$($classes$$4$$, $classesToRemove$$));
  $goog$isString$$($classesToAdd$$) && !$goog$array$contains$$($classes$$4$$, $classesToAdd$$) ? $classes$$4$$.push($classesToAdd$$) : $goog$isArray$$($classesToAdd$$) && $goog$dom$classes$add_$$($classes$$4$$, $classesToAdd$$);
  $element$$11$$.className = $classes$$4$$.join(" ")
}
;function $goog$math$Coordinate$$($opt_x$$, $opt_y$$) {
  this.x = $goog$isDef$$($opt_x$$) ? $opt_x$$ : 0;
  this.y = $goog$isDef$$($opt_y$$) ? $opt_y$$ : 0
}
;function $goog$math$Size$$($width$$12$$, $height$$11$$) {
  this.width = $width$$12$$;
  this.height = $height$$11$$
}
$goog$math$Size$$.prototype.floor = function $$goog$math$Size$$$$floor$() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
$goog$math$Size$$.prototype.round = function $$goog$math$Size$$$$round$() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
function $goog$object$forEach$$($obj$$30$$, $f$$18$$) {
  for(var $key$$18$$ in $obj$$30$$) {
    $f$$18$$.call($JSCompiler_alias_VOID$$, $obj$$30$$[$key$$18$$], $key$$18$$, $obj$$30$$)
  }
}
var $goog$object$PROTOTYPE_FIELDS_$$ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function $goog$object$extend$$($target$$42$$, $var_args$$51$$) {
  for(var $key$$41$$, $source$$2$$, $i$$47$$ = 1;$i$$47$$ < arguments.length;$i$$47$$++) {
    $source$$2$$ = arguments[$i$$47$$];
    for($key$$41$$ in $source$$2$$) {
      $target$$42$$[$key$$41$$] = $source$$2$$[$key$$41$$]
    }
    for(var $j$$5$$ = 0;$j$$5$$ < $goog$object$PROTOTYPE_FIELDS_$$.length;$j$$5$$++) {
      $key$$41$$ = $goog$object$PROTOTYPE_FIELDS_$$[$j$$5$$], Object.prototype.hasOwnProperty.call($source$$2$$, $key$$41$$) && ($target$$42$$[$key$$41$$] = $source$$2$$[$key$$41$$])
    }
  }
}
;function $goog$dom$getDomHelper$$($opt_element$$10$$) {
  return $opt_element$$10$$ ? new $goog$dom$DomHelper$$($goog$dom$getOwnerDocument$$($opt_element$$10$$)) : $goog$dom$defaultDomHelper_$$ || ($goog$dom$defaultDomHelper_$$ = new $goog$dom$DomHelper$$)
}
var $goog$dom$DIRECT_ATTRIBUTE_MAP_$$ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
function $goog$dom$createDom$$($tagName$$2$$, $opt_attributes$$, $var_args$$54$$) {
  var $args$$inline_99$$ = arguments, $doc$$inline_100$$ = document, $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$ = $args$$inline_99$$[0], $attributes$$inline_102$$ = $args$$inline_99$$[1];
  if(!$goog$dom$BrowserFeature$CAN_ADD_NAME_OR_TYPE_ATTRIBUTES$$ && $attributes$$inline_102$$ && ($attributes$$inline_102$$.name || $attributes$$inline_102$$.type)) {
    $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$ = ["<", $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$];
    $attributes$$inline_102$$.name && $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$.push(' name="', $goog$string$htmlEscape$$($attributes$$inline_102$$.name), '"');
    if($attributes$$inline_102$$.type) {
      $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$.push(' type="', $goog$string$htmlEscape$$($attributes$$inline_102$$.type), '"');
      var $clone$$inline_104$$ = {};
      $goog$object$extend$$($clone$$inline_104$$, $attributes$$inline_102$$);
      delete $clone$$inline_104$$.type;
      $attributes$$inline_102$$ = $clone$$inline_104$$
    }
    $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$.push(">");
    $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$ = $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$.join("")
  }
  $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$ = $doc$$inline_100$$.createElement($element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$);
  if($attributes$$inline_102$$) {
    if($goog$isString$$($attributes$$inline_102$$)) {
      $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$.className = $attributes$$inline_102$$
    }else {
      if($goog$isArray$$($attributes$$inline_102$$)) {
        $goog$dom$classes$add$$.apply($JSCompiler_alias_NULL$$, [$element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$].concat($attributes$$inline_102$$))
      }else {
        var $element$$inline_796$$ = $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$;
        $goog$object$forEach$$($attributes$$inline_102$$, function($val$$inline_798$$, $key$$inline_799$$) {
          "style" == $key$$inline_799$$ ? $element$$inline_796$$.style.cssText = $val$$inline_798$$ : "class" == $key$$inline_799$$ ? $element$$inline_796$$.className = $val$$inline_798$$ : "for" == $key$$inline_799$$ ? $element$$inline_796$$.htmlFor = $val$$inline_798$$ : $key$$inline_799$$ in $goog$dom$DIRECT_ATTRIBUTE_MAP_$$ ? $element$$inline_796$$.setAttribute($goog$dom$DIRECT_ATTRIBUTE_MAP_$$[$key$$inline_799$$], $val$$inline_798$$) : 0 == $key$$inline_799$$.lastIndexOf("aria-", 0) || 0 ==
          $key$$inline_799$$.lastIndexOf("data-", 0) ? $element$$inline_796$$.setAttribute($key$$inline_799$$, $val$$inline_798$$) : $element$$inline_796$$[$key$$inline_799$$] = $val$$inline_798$$
        })
      }
    }
  }
  2 < $args$$inline_99$$.length && $goog$dom$append_$$($doc$$inline_100$$, $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$, $args$$inline_99$$, 2);
  return $element$$inline_105_tagName$$inline_101_tagNameArr$$inline_103$$
}
function $goog$dom$append_$$($doc$$12$$, $parent$$6$$, $args$$7$$, $i$$51_startIndex$$) {
  function $childHandler$$($child$$1$$) {
    $child$$1$$ && $parent$$6$$.appendChild($goog$isString$$($child$$1$$) ? $doc$$12$$.createTextNode($child$$1$$) : $child$$1$$)
  }
  for(;$i$$51_startIndex$$ < $args$$7$$.length;$i$$51_startIndex$$++) {
    var $arg$$5$$ = $args$$7$$[$i$$51_startIndex$$];
    if($goog$isArrayLike$$($arg$$5$$) && !($goog$isObject$$($arg$$5$$) && 0 < $arg$$5$$.nodeType)) {
      var $JSCompiler_inline_result$$7$$;
      a: {
        if($arg$$5$$ && "number" == typeof $arg$$5$$.length) {
          if($goog$isObject$$($arg$$5$$)) {
            $JSCompiler_inline_result$$7$$ = "function" == typeof $arg$$5$$.item || "string" == typeof $arg$$5$$.item;
            break a
          }
          if($goog$isFunction$$($arg$$5$$)) {
            $JSCompiler_inline_result$$7$$ = "function" == typeof $arg$$5$$.item;
            break a
          }
        }
        $JSCompiler_inline_result$$7$$ = $JSCompiler_alias_FALSE$$
      }
      $goog$array$forEach$$($JSCompiler_inline_result$$7$$ ? $goog$array$toArray$$($arg$$5$$) : $arg$$5$$, $childHandler$$)
    }else {
      $childHandler$$($arg$$5$$)
    }
  }
}
function $goog$dom$removeChildren$$($node$$3$$) {
  for(var $child$$3$$;$child$$3$$ = $node$$3$$.firstChild;) {
    $node$$3$$.removeChild($child$$3$$)
  }
}
function $goog$dom$removeNode$$($node$$4$$) {
  $node$$4$$ && $node$$4$$.parentNode && $node$$4$$.parentNode.removeChild($node$$4$$)
}
function $goog$dom$replaceNode$$($newNode$$3$$, $oldNode$$) {
  var $parent$$10$$ = $oldNode$$.parentNode;
  $parent$$10$$ && $parent$$10$$.replaceChild($newNode$$3$$, $oldNode$$)
}
function $goog$dom$isElement$$($obj$$59$$) {
  return $goog$isObject$$($obj$$59$$) && 1 == $obj$$59$$.nodeType
}
function $goog$dom$contains$$($parent$$13$$, $descendant$$) {
  if($parent$$13$$.contains && 1 == $descendant$$.nodeType) {
    return $parent$$13$$ == $descendant$$ || $parent$$13$$.contains($descendant$$)
  }
  if("undefined" != typeof $parent$$13$$.compareDocumentPosition) {
    return $parent$$13$$ == $descendant$$ || Boolean($parent$$13$$.compareDocumentPosition($descendant$$) & 16)
  }
  for(;$descendant$$ && $parent$$13$$ != $descendant$$;) {
    $descendant$$ = $descendant$$.parentNode
  }
  return $descendant$$ == $parent$$13$$
}
function $goog$dom$getOwnerDocument$$($node$$15$$) {
  return 9 == $node$$15$$.nodeType ? $node$$15$$ : $node$$15$$.ownerDocument || $node$$15$$.document
}
function $goog$dom$isFocusableTabIndex$$($element$$23_index$$53$$) {
  var $attrNode$$ = $element$$23_index$$53$$.getAttributeNode("tabindex");
  return $attrNode$$ && $attrNode$$.specified ? ($element$$23_index$$53$$ = $element$$23_index$$53$$.tabIndex, "number" == typeof $element$$23_index$$53$$ && 0 <= $element$$23_index$$53$$ && 32768 > $element$$23_index$$53$$) : $JSCompiler_alias_FALSE$$
}
function $goog$dom$DomHelper$$($opt_document$$) {
  this.$document_$ = $opt_document$$ || $goog$global$$.document || document
}
$JSCompiler_prototypeAlias$$ = $goog$dom$DomHelper$$.prototype;
$JSCompiler_prototypeAlias$$.$getDomHelper$ = $goog$dom$getDomHelper$$;
$JSCompiler_prototypeAlias$$.$getElement$ = function $$JSCompiler_prototypeAlias$$$$getElement$$($element$$28$$) {
  return $goog$isString$$($element$$28$$) ? this.$document_$.getElementById($element$$28$$) : $element$$28$$
};
$JSCompiler_prototypeAlias$$.createElement = function $$JSCompiler_prototypeAlias$$$createElement$($name$$61$$) {
  return this.$document_$.createElement($name$$61$$)
};
$JSCompiler_prototypeAlias$$.createTextNode = function $$JSCompiler_prototypeAlias$$$createTextNode$($content$$1$$) {
  return this.$document_$.createTextNode($content$$1$$)
};
function $JSCompiler_StaticMethods_getDocumentScroll$$($JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_110$$) {
  var $doc$$inline_109_win$$inline_111$$ = $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_110$$.$document_$, $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_110$$ = !$goog$userAgent$WEBKIT$$ ? $doc$$inline_109_win$$inline_111$$.documentElement : $doc$$inline_109_win$$inline_111$$.body, $doc$$inline_109_win$$inline_111$$ = $doc$$inline_109_win$$inline_111$$.parentWindow || $doc$$inline_109_win$$inline_111$$.defaultView;
  return new $goog$math$Coordinate$$($doc$$inline_109_win$$inline_111$$.pageXOffset || $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_110$$.scrollLeft, $doc$$inline_109_win$$inline_111$$.pageYOffset || $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_110$$.scrollTop)
}
$JSCompiler_prototypeAlias$$.appendChild = function $$JSCompiler_prototypeAlias$$$appendChild$($parent$$7$$, $child$$2$$) {
  $parent$$7$$.appendChild($child$$2$$)
};
$JSCompiler_prototypeAlias$$.append = function $$JSCompiler_prototypeAlias$$$append$($parent$$8$$, $var_args$$55$$) {
  $goog$dom$append_$$($goog$dom$getOwnerDocument$$($parent$$8$$), $parent$$8$$, arguments, 1)
};
$JSCompiler_prototypeAlias$$.contains = $goog$dom$contains$$;
var $goog$functions$TRUE$$;
$goog$functions$TRUE$$ = $JSCompiler_returnArg$$($JSCompiler_alias_TRUE$$);
/*
 Portions of this code are from the Dojo Toolkit, received by
 The Closure Library Authors under the BSD license. All other code is
 Copyright 2005-2009 The Closure Library Authors. All Rights Reserved.

The "New" BSD License:

Copyright (c) 2005-2009, The Dojo Foundation
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.
 Neither the name of the Dojo Foundation nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function $getArr$$inline_115$$($i$$inline_153$$, $opt_arr$$inline_154$$) {
  var $r$$inline_155$$ = $opt_arr$$inline_154$$ || [];
  $i$$inline_153$$ && $r$$inline_155$$.push($i$$inline_153$$);
  return $r$$inline_155$$
}
var $cssCaseBug$$inline_116$$ = $goog$userAgent$WEBKIT$$ && "BackCompat" == document.compatMode, $childNodesName$$inline_117$$ = document.firstChild.children ? "children" : "childNodes", $caseSensitive$$inline_118$$ = $JSCompiler_alias_FALSE$$;
function $getQueryParts$$inline_119$$($query$$inline_156$$) {
  function $endAll$$inline_176$$() {
    0 <= $inId$$inline_164$$ && ($currentPart$$inline_171$$.id = $ts$$inline_157$$($inId$$inline_164$$, $x$$inline_169$$).replace(/\\/g, ""), $inId$$inline_164$$ = -1);
    if(0 <= $inTag$$inline_165$$) {
      var $tv$$inline_802$$ = $inTag$$inline_165$$ == $x$$inline_169$$ ? $JSCompiler_alias_NULL$$ : $ts$$inline_157$$($inTag$$inline_165$$, $x$$inline_169$$);
      0 > ">~+".indexOf($tv$$inline_802$$) ? $currentPart$$inline_171$$.$tag$ = $tv$$inline_802$$ : $currentPart$$inline_171$$.$oper$ = $tv$$inline_802$$;
      $inTag$$inline_165$$ = -1
    }
    0 <= $inClass$$inline_163$$ && ($currentPart$$inline_171$$.$classes$.push($ts$$inline_157$$($inClass$$inline_163$$ + 1, $x$$inline_169$$).replace(/\\/g, "")), $inClass$$inline_163$$ = -1)
  }
  function $ts$$inline_157$$($s$$inline_180$$, $e$$inline_181$$) {
    return $goog$string$trim$$($query$$inline_156$$.slice($s$$inline_180$$, $e$$inline_181$$))
  }
  for(var $query$$inline_156$$ = 0 <= ">~+".indexOf($query$$inline_156$$.slice(-1)) ? $query$$inline_156$$ + " * " : $query$$inline_156$$ + " ", $queryParts$$inline_158$$ = [], $cmf$$inline_178_inBrackets$$inline_159$$ = -1, $inParens$$inline_160$$ = -1, $addToCc$$inline_179_inMatchFor$$inline_161$$ = -1, $inPseudo$$inline_162$$ = -1, $inClass$$inline_163$$ = -1, $inId$$inline_164$$ = -1, $inTag$$inline_165$$ = -1, $lc$$inline_166$$ = "", $cc$$inline_167$$ = "", $pStart$$inline_168$$, $x$$inline_169$$ =
  0, $ql$$inline_170$$ = $query$$inline_156$$.length, $currentPart$$inline_171$$ = $JSCompiler_alias_NULL$$, $cp$$inline_172$$ = $JSCompiler_alias_NULL$$;$lc$$inline_166$$ = $cc$$inline_167$$, $cc$$inline_167$$ = $query$$inline_156$$.charAt($x$$inline_169$$), $x$$inline_169$$ < $ql$$inline_170$$;$x$$inline_169$$++) {
    if("\\" != $lc$$inline_166$$) {
      if($currentPart$$inline_171$$ || ($pStart$$inline_168$$ = $x$$inline_169$$, $currentPart$$inline_171$$ = {$query$:$JSCompiler_alias_NULL$$, $pseudos$:[], $attrs$:[], $classes$:[], $tag$:$JSCompiler_alias_NULL$$, $oper$:$JSCompiler_alias_NULL$$, id:$JSCompiler_alias_NULL$$, $getTag$:function $$currentPart$$inline_171$$$$getTag$$() {
        return $caseSensitive$$inline_118$$ ? this.$otag$ : this.$tag$
      }}, $inTag$$inline_165$$ = $x$$inline_169$$), 0 <= $cmf$$inline_178_inBrackets$$inline_159$$) {
        if("]" == $cc$$inline_167$$) {
          $cp$$inline_172$$.$attr$ ? $cp$$inline_172$$.$matchFor$ = $ts$$inline_157$$($addToCc$$inline_179_inMatchFor$$inline_161$$ || $cmf$$inline_178_inBrackets$$inline_159$$ + 1, $x$$inline_169$$) : $cp$$inline_172$$.$attr$ = $ts$$inline_157$$($cmf$$inline_178_inBrackets$$inline_159$$ + 1, $x$$inline_169$$);
          if(($cmf$$inline_178_inBrackets$$inline_159$$ = $cp$$inline_172$$.$matchFor$) && ('"' == $cmf$$inline_178_inBrackets$$inline_159$$.charAt(0) || "'" == $cmf$$inline_178_inBrackets$$inline_159$$.charAt(0))) {
            $cp$$inline_172$$.$matchFor$ = $cmf$$inline_178_inBrackets$$inline_159$$.slice(1, -1)
          }
          $currentPart$$inline_171$$.$attrs$.push($cp$$inline_172$$);
          $cp$$inline_172$$ = $JSCompiler_alias_NULL$$;
          $cmf$$inline_178_inBrackets$$inline_159$$ = $addToCc$$inline_179_inMatchFor$$inline_161$$ = -1
        }else {
          "=" == $cc$$inline_167$$ && ($addToCc$$inline_179_inMatchFor$$inline_161$$ = 0 <= "|~^$*".indexOf($lc$$inline_166$$) ? $lc$$inline_166$$ : "", $cp$$inline_172$$.type = $addToCc$$inline_179_inMatchFor$$inline_161$$ + $cc$$inline_167$$, $cp$$inline_172$$.$attr$ = $ts$$inline_157$$($cmf$$inline_178_inBrackets$$inline_159$$ + 1, $x$$inline_169$$ - $addToCc$$inline_179_inMatchFor$$inline_161$$.length), $addToCc$$inline_179_inMatchFor$$inline_161$$ = $x$$inline_169$$ + 1)
        }
      }else {
        0 <= $inParens$$inline_160$$ ? ")" == $cc$$inline_167$$ && (0 <= $inPseudo$$inline_162$$ && ($cp$$inline_172$$.value = $ts$$inline_157$$($inParens$$inline_160$$ + 1, $x$$inline_169$$)), $inPseudo$$inline_162$$ = $inParens$$inline_160$$ = -1) : "#" == $cc$$inline_167$$ ? ($endAll$$inline_176$$(), $inId$$inline_164$$ = $x$$inline_169$$ + 1) : "." == $cc$$inline_167$$ ? ($endAll$$inline_176$$(), $inClass$$inline_163$$ = $x$$inline_169$$) : ":" == $cc$$inline_167$$ ? ($endAll$$inline_176$$(),
        $inPseudo$$inline_162$$ = $x$$inline_169$$) : "[" == $cc$$inline_167$$ ? ($endAll$$inline_176$$(), $cmf$$inline_178_inBrackets$$inline_159$$ = $x$$inline_169$$, $cp$$inline_172$$ = {}) : "(" == $cc$$inline_167$$ ? (0 <= $inPseudo$$inline_162$$ && ($cp$$inline_172$$ = {name:$ts$$inline_157$$($inPseudo$$inline_162$$ + 1, $x$$inline_169$$), value:$JSCompiler_alias_NULL$$}, $currentPart$$inline_171$$.$pseudos$.push($cp$$inline_172$$)), $inParens$$inline_160$$ = $x$$inline_169$$) : " " == $cc$$inline_167$$ &&
        $lc$$inline_166$$ != $cc$$inline_167$$ && ($endAll$$inline_176$$(), 0 <= $inPseudo$$inline_162$$ && $currentPart$$inline_171$$.$pseudos$.push({name:$ts$$inline_157$$($inPseudo$$inline_162$$ + 1, $x$$inline_169$$)}), $currentPart$$inline_171$$.$loops$ = $currentPart$$inline_171$$.$pseudos$.length || $currentPart$$inline_171$$.$attrs$.length || $currentPart$$inline_171$$.$classes$.length, $currentPart$$inline_171$$.$oquery$ = $currentPart$$inline_171$$.$query$ = $ts$$inline_157$$($pStart$$inline_168$$,
        $x$$inline_169$$), $currentPart$$inline_171$$.$otag$ = $currentPart$$inline_171$$.$tag$ = $currentPart$$inline_171$$.$oper$ ? $JSCompiler_alias_NULL$$ : $currentPart$$inline_171$$.$tag$ || "*", $currentPart$$inline_171$$.$tag$ && ($currentPart$$inline_171$$.$tag$ = $currentPart$$inline_171$$.$tag$.toUpperCase()), $queryParts$$inline_158$$.length && $queryParts$$inline_158$$[$queryParts$$inline_158$$.length - 1].$oper$ && ($currentPart$$inline_171$$.$infixOper$ = $queryParts$$inline_158$$.pop(),
        $currentPart$$inline_171$$.$query$ = $currentPart$$inline_171$$.$infixOper$.$query$ + " " + $currentPart$$inline_171$$.$query$), $queryParts$$inline_158$$.push($currentPart$$inline_171$$), $currentPart$$inline_171$$ = $JSCompiler_alias_NULL$$)
      }
    }
  }
  return $queryParts$$inline_158$$
}
function $agree$$inline_120$$($first$$inline_183$$, $second$$inline_184$$) {
  return!$first$$inline_183$$ ? $second$$inline_184$$ : !$second$$inline_184$$ ? $first$$inline_183$$ : function() {
    return $first$$inline_183$$.apply(window, arguments) && $second$$inline_184$$.apply(window, arguments)
  }
}
function $isElement$$inline_121$$($n$$inline_185$$) {
  return 1 == $n$$inline_185$$.nodeType
}
function $getAttr$$inline_122$$($elem$$inline_186$$, $attr$$inline_187$$) {
  return!$elem$$inline_186$$ ? "" : "class" == $attr$$inline_187$$ ? $elem$$inline_186$$.className || "" : "for" == $attr$$inline_187$$ ? $elem$$inline_186$$.htmlFor || "" : "style" == $attr$$inline_187$$ ? $elem$$inline_186$$.style.cssText || "" : ($caseSensitive$$inline_118$$ ? $elem$$inline_186$$.getAttribute($attr$$inline_187$$) : $elem$$inline_186$$.getAttribute($attr$$inline_187$$, 2)) || ""
}
var $attrs$$inline_123$$ = {"*=":function($attr$$inline_188$$, $value$$inline_189$$) {
  return function($elem$$inline_190$$) {
    return 0 <= $getAttr$$inline_122$$($elem$$inline_190$$, $attr$$inline_188$$).indexOf($value$$inline_189$$)
  }
}, "^=":function($attr$$inline_191$$, $value$$inline_192$$) {
  return function($elem$$inline_193$$) {
    return 0 == $getAttr$$inline_122$$($elem$$inline_193$$, $attr$$inline_191$$).indexOf($value$$inline_192$$)
  }
}, "$=":function($attr$$inline_194$$, $value$$inline_195$$) {
  return function($ea$$inline_197_elem$$inline_196$$) {
    $ea$$inline_197_elem$$inline_196$$ = " " + $getAttr$$inline_122$$($ea$$inline_197_elem$$inline_196$$, $attr$$inline_194$$);
    return $ea$$inline_197_elem$$inline_196$$.lastIndexOf($value$$inline_195$$) == $ea$$inline_197_elem$$inline_196$$.length - $value$$inline_195$$.length
  }
}, "~=":function($attr$$inline_198$$, $value$$inline_199$$) {
  var $tval$$inline_200$$ = " " + $value$$inline_199$$ + " ";
  return function($elem$$inline_201$$) {
    return 0 <= (" " + $getAttr$$inline_122$$($elem$$inline_201$$, $attr$$inline_198$$) + " ").indexOf($tval$$inline_200$$)
  }
}, "|=":function($attr$$inline_202$$, $value$$inline_203$$) {
  $value$$inline_203$$ = " " + $value$$inline_203$$;
  return function($ea$$inline_205_elem$$inline_204$$) {
    $ea$$inline_205_elem$$inline_204$$ = " " + $getAttr$$inline_122$$($ea$$inline_205_elem$$inline_204$$, $attr$$inline_202$$);
    return $ea$$inline_205_elem$$inline_204$$ == $value$$inline_203$$ || 0 == $ea$$inline_205_elem$$inline_204$$.indexOf($value$$inline_203$$ + "-")
  }
}, "=":function($attr$$inline_206$$, $value$$inline_207$$) {
  return function($elem$$inline_208$$) {
    return $getAttr$$inline_122$$($elem$$inline_208$$, $attr$$inline_206$$) == $value$$inline_207$$
  }
}}, $noNextElementSibling$$inline_124$$ = "undefined" == typeof document.firstChild.nextElementSibling, $nSibling$$inline_125$$ = !$noNextElementSibling$$inline_124$$ ? "nextElementSibling" : "nextSibling", $pSibling$$inline_126$$ = !$noNextElementSibling$$inline_124$$ ? "previousElementSibling" : "previousSibling", $simpleNodeTest$$inline_127$$ = $noNextElementSibling$$inline_124$$ ? $isElement$$inline_121$$ : $goog$functions$TRUE$$;
function $_lookLeft$$inline_128$$($node$$inline_209$$) {
  for(;$node$$inline_209$$ = $node$$inline_209$$[$pSibling$$inline_126$$];) {
    if($simpleNodeTest$$inline_127$$($node$$inline_209$$)) {
      return $JSCompiler_alias_FALSE$$
    }
  }
  return $JSCompiler_alias_TRUE$$
}
function $_lookRight$$inline_129$$($node$$inline_210$$) {
  for(;$node$$inline_210$$ = $node$$inline_210$$[$nSibling$$inline_125$$];) {
    if($simpleNodeTest$$inline_127$$($node$$inline_210$$)) {
      return $JSCompiler_alias_FALSE$$
    }
  }
  return $JSCompiler_alias_TRUE$$
}
function $getNodeIndex$$inline_130$$($node$$inline_211$$) {
  var $root$$inline_212_te$$inline_218$$ = $node$$inline_211$$.parentNode, $i$$inline_213$$ = 0, $l$$inline_217_tret$$inline_214$$ = $root$$inline_212_te$$inline_218$$[$childNodesName$$inline_117$$], $ci$$inline_215$$ = $node$$inline_211$$._i || -1, $cl$$inline_216$$ = $root$$inline_212_te$$inline_218$$._l || -1;
  if(!$l$$inline_217_tret$$inline_214$$) {
    return-1
  }
  $l$$inline_217_tret$$inline_214$$ = $l$$inline_217_tret$$inline_214$$.length;
  if($cl$$inline_216$$ == $l$$inline_217_tret$$inline_214$$ && 0 <= $ci$$inline_215$$ && 0 <= $cl$$inline_216$$) {
    return $ci$$inline_215$$
  }
  $root$$inline_212_te$$inline_218$$._l = $l$$inline_217_tret$$inline_214$$;
  $ci$$inline_215$$ = -1;
  for($root$$inline_212_te$$inline_218$$ = $root$$inline_212_te$$inline_218$$.firstElementChild || $root$$inline_212_te$$inline_218$$.firstChild;$root$$inline_212_te$$inline_218$$;$root$$inline_212_te$$inline_218$$ = $root$$inline_212_te$$inline_218$$[$nSibling$$inline_125$$]) {
    $simpleNodeTest$$inline_127$$($root$$inline_212_te$$inline_218$$) && ($root$$inline_212_te$$inline_218$$._i = ++$i$$inline_213$$, $node$$inline_211$$ === $root$$inline_212_te$$inline_218$$ && ($ci$$inline_215$$ = $i$$inline_213$$))
  }
  return $ci$$inline_215$$
}
function $isEven$$inline_131$$($elem$$inline_219$$) {
  return!($getNodeIndex$$inline_130$$($elem$$inline_219$$) % 2)
}
function $isOdd$$inline_132$$($elem$$inline_220$$) {
  return $getNodeIndex$$inline_130$$($elem$$inline_220$$) % 2
}
var $pseudos$$inline_133$$ = {checked:function() {
  return function($elem$$inline_221$$) {
    return $elem$$inline_221$$.checked || $elem$$inline_221$$.attributes.checked
  }
}, "first-child":function() {
  return $_lookLeft$$inline_128$$
}, "last-child":function() {
  return $_lookRight$$inline_129$$
}, "only-child":function() {
  return function($node$$inline_222$$) {
    return!$_lookLeft$$inline_128$$($node$$inline_222$$) || !$_lookRight$$inline_129$$($node$$inline_222$$) ? $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_TRUE$$
  }
}, empty:function() {
  return function($elem$$inline_223_x$$inline_225$$) {
    for(var $cn$$inline_224$$ = $elem$$inline_223_x$$inline_225$$.childNodes, $elem$$inline_223_x$$inline_225$$ = $elem$$inline_223_x$$inline_225$$.childNodes.length - 1;0 <= $elem$$inline_223_x$$inline_225$$;$elem$$inline_223_x$$inline_225$$--) {
      var $nt$$inline_226$$ = $cn$$inline_224$$[$elem$$inline_223_x$$inline_225$$].nodeType;
      if(1 === $nt$$inline_226$$ || 3 == $nt$$inline_226$$) {
        return $JSCompiler_alias_FALSE$$
      }
    }
    return $JSCompiler_alias_TRUE$$
  }
}, contains:function($name$$inline_227$$, $condition$$inline_228$$) {
  var $cz$$inline_229$$ = $condition$$inline_228$$.charAt(0);
  if('"' == $cz$$inline_229$$ || "'" == $cz$$inline_229$$) {
    $condition$$inline_228$$ = $condition$$inline_228$$.slice(1, -1)
  }
  return function($elem$$inline_230$$) {
    return 0 <= $elem$$inline_230$$.innerHTML.indexOf($condition$$inline_228$$)
  }
}, not:function($name$$inline_231$$, $condition$$inline_232$$) {
  var $p$$inline_233$$ = $getQueryParts$$inline_119$$($condition$$inline_232$$)[0], $ignores$$inline_234$$ = {$el$:1};
  "*" != $p$$inline_233$$.$tag$ && ($ignores$$inline_234$$.$tag$ = 1);
  $p$$inline_233$$.$classes$.length || ($ignores$$inline_234$$.$classes$ = 1);
  var $ntf$$inline_235$$ = $getSimpleFilterFunc$$inline_135$$($p$$inline_233$$, $ignores$$inline_234$$);
  return function($elem$$inline_236$$) {
    return!$ntf$$inline_235$$($elem$$inline_236$$)
  }
}, "nth-child":function($name$$inline_237$$, $condition$$inline_238$$) {
  if("odd" == $condition$$inline_238$$) {
    return $isOdd$$inline_132$$
  }
  if("even" == $condition$$inline_238$$) {
    return $isEven$$inline_131$$
  }
  if(-1 != $condition$$inline_238$$.indexOf("n")) {
    var $tparts$$inline_240$$ = $condition$$inline_238$$.split("n", 2), $pred$$inline_241$$ = $tparts$$inline_240$$[0] ? "-" == $tparts$$inline_240$$[0] ? -1 : parseInt($tparts$$inline_240$$[0], 10) : 1, $idx$$inline_242$$ = $tparts$$inline_240$$[1] ? parseInt($tparts$$inline_240$$[1], 10) : 0, $lb$$inline_243$$ = 0, $ub$$inline_244$$ = -1;
    0 < $pred$$inline_241$$ ? 0 > $idx$$inline_242$$ ? $idx$$inline_242$$ = $idx$$inline_242$$ % $pred$$inline_241$$ && $pred$$inline_241$$ + $idx$$inline_242$$ % $pred$$inline_241$$ : 0 < $idx$$inline_242$$ && ($idx$$inline_242$$ >= $pred$$inline_241$$ && ($lb$$inline_243$$ = $idx$$inline_242$$ - $idx$$inline_242$$ % $pred$$inline_241$$), $idx$$inline_242$$ %= $pred$$inline_241$$) : 0 > $pred$$inline_241$$ && ($pred$$inline_241$$ *= -1, 0 < $idx$$inline_242$$ && ($ub$$inline_244$$ = $idx$$inline_242$$,
    $idx$$inline_242$$ %= $pred$$inline_241$$));
    if(0 < $pred$$inline_241$$) {
      return function($elem$$inline_247_i$$inline_248$$) {
        $elem$$inline_247_i$$inline_248$$ = $getNodeIndex$$inline_130$$($elem$$inline_247_i$$inline_248$$);
        return $elem$$inline_247_i$$inline_248$$ >= $lb$$inline_243$$ && (0 > $ub$$inline_244$$ || $elem$$inline_247_i$$inline_248$$ <= $ub$$inline_244$$) && $elem$$inline_247_i$$inline_248$$ % $pred$$inline_241$$ == $idx$$inline_242$$
      }
    }
    $condition$$inline_238$$ = $idx$$inline_242$$
  }
  var $ncount$$inline_245$$ = parseInt($condition$$inline_238$$, 10);
  return function($elem$$inline_249$$) {
    return $getNodeIndex$$inline_130$$($elem$$inline_249$$) == $ncount$$inline_245$$
  }
}}, $defaultGetter$$inline_134$$ = $goog$userAgent$IE$$ ? function($cond$$inline_250$$) {
  var $clc$$inline_251$$ = $cond$$inline_250$$.toLowerCase();
  "class" == $clc$$inline_251$$ && ($cond$$inline_250$$ = "className");
  return function($elem$$inline_252$$) {
    return $caseSensitive$$inline_118$$ ? $elem$$inline_252$$.getAttribute($cond$$inline_250$$) : $elem$$inline_252$$[$cond$$inline_250$$] || $elem$$inline_252$$[$clc$$inline_251$$]
  }
} : function($cond$$inline_253$$) {
  return function($elem$$inline_254$$) {
    return $elem$$inline_254$$ && $elem$$inline_254$$.getAttribute && $elem$$inline_254$$.hasAttribute($cond$$inline_253$$)
  }
};
function $getSimpleFilterFunc$$inline_135$$($query$$inline_255$$, $ignores$$inline_256$$) {
  if(!$query$$inline_255$$) {
    return $goog$functions$TRUE$$
  }
  var $ignores$$inline_256$$ = $ignores$$inline_256$$ || {}, $ff$$inline_257$$ = $JSCompiler_alias_NULL$$;
  $ignores$$inline_256$$.$el$ || ($ff$$inline_257$$ = $agree$$inline_120$$($ff$$inline_257$$, $isElement$$inline_121$$));
  $ignores$$inline_256$$.$tag$ || "*" != $query$$inline_255$$.$tag$ && ($ff$$inline_257$$ = $agree$$inline_120$$($ff$$inline_257$$, function($elem$$inline_258$$) {
    return $elem$$inline_258$$ && $elem$$inline_258$$.tagName == $query$$inline_255$$.$getTag$()
  }));
  $ignores$$inline_256$$.$classes$ || $goog$array$forEach$$($query$$inline_255$$.$classes$, function($cname$$inline_259$$, $idx$$inline_260$$) {
    var $re$$inline_261$$ = RegExp("(?:^|\\s)" + $cname$$inline_259$$ + "(?:\\s|$)");
    $ff$$inline_257$$ = $agree$$inline_120$$($ff$$inline_257$$, function($elem$$inline_262$$) {
      return $re$$inline_261$$.test($elem$$inline_262$$.className)
    });
    $ff$$inline_257$$.count = $idx$$inline_260$$
  });
  $ignores$$inline_256$$.$pseudos$ || $goog$array$forEach$$($query$$inline_255$$.$pseudos$, function($pseudo$$inline_263$$) {
    var $pn$$inline_264$$ = $pseudo$$inline_263$$.name;
    $pseudos$$inline_133$$[$pn$$inline_264$$] && ($ff$$inline_257$$ = $agree$$inline_120$$($ff$$inline_257$$, $pseudos$$inline_133$$[$pn$$inline_264$$]($pn$$inline_264$$, $pseudo$$inline_263$$.value)))
  });
  $ignores$$inline_256$$.$attrs$ || $goog$array$forEach$$($query$$inline_255$$.$attrs$, function($attr$$inline_265$$) {
    var $matcher$$inline_266$$, $a$$inline_267$$ = $attr$$inline_265$$.$attr$;
    $attr$$inline_265$$.type && $attrs$$inline_123$$[$attr$$inline_265$$.type] ? $matcher$$inline_266$$ = $attrs$$inline_123$$[$attr$$inline_265$$.type]($a$$inline_267$$, $attr$$inline_265$$.$matchFor$) : $a$$inline_267$$.length && ($matcher$$inline_266$$ = $defaultGetter$$inline_134$$($a$$inline_267$$));
    $matcher$$inline_266$$ && ($ff$$inline_257$$ = $agree$$inline_120$$($ff$$inline_257$$, $matcher$$inline_266$$))
  });
  $ignores$$inline_256$$.id || $query$$inline_255$$.id && ($ff$$inline_257$$ = $agree$$inline_120$$($ff$$inline_257$$, function($elem$$inline_268$$) {
    return!!$elem$$inline_268$$ && $elem$$inline_268$$.id == $query$$inline_255$$.id
  }));
  $ff$$inline_257$$ || "default" in $ignores$$inline_256$$ || ($ff$$inline_257$$ = $goog$functions$TRUE$$);
  return $ff$$inline_257$$
}
var $_getElementsFuncCache$$inline_140$$ = {};
function $getElementsFunc$$inline_141$$($query$$inline_288$$) {
  var $retFunc$$inline_289$$ = $_getElementsFuncCache$$inline_140$$[$query$$inline_288$$.$query$];
  if($retFunc$$inline_289$$) {
    return $retFunc$$inline_289$$
  }
  var $io$$inline_290_oper$$inline_291$$ = $query$$inline_288$$.$infixOper$, $io$$inline_290_oper$$inline_291$$ = $io$$inline_290_oper$$inline_291$$ ? $io$$inline_290_oper$$inline_291$$.$oper$ : "", $filterFunc$$inline_292$$ = $getSimpleFilterFunc$$inline_135$$($query$$inline_288$$, {$el$:1}), $wildcardTag$$inline_293$$ = "*" == $query$$inline_288$$.$tag$, $ecs$$inline_294_skipFilters$$inline_295$$ = document.getElementsByClassName;
  if($io$$inline_290_oper$$inline_291$$) {
    if($ecs$$inline_294_skipFilters$$inline_295$$ = {$el$:1}, $wildcardTag$$inline_293$$ && ($ecs$$inline_294_skipFilters$$inline_295$$.$tag$ = 1), $filterFunc$$inline_292$$ = $getSimpleFilterFunc$$inline_135$$($query$$inline_288$$, $ecs$$inline_294_skipFilters$$inline_295$$), "+" == $io$$inline_290_oper$$inline_291$$) {
      var $filterFunc$$inline_806$$ = $filterFunc$$inline_292$$, $retFunc$$inline_289$$ = function $$retFunc$$inline_289$$$($node$$inline_807$$, $ret$$inline_808$$, $bag$$inline_809$$) {
        for(;$node$$inline_807$$ = $node$$inline_807$$[$nSibling$$inline_125$$];) {
          if(!$noNextElementSibling$$inline_124$$ || $isElement$$inline_121$$($node$$inline_807$$)) {
            (!$bag$$inline_809$$ || $_isUnique$$inline_150$$($node$$inline_807$$, $bag$$inline_809$$)) && $filterFunc$$inline_806$$($node$$inline_807$$) && $ret$$inline_808$$.push($node$$inline_807$$);
            break
          }
        }
        return $ret$$inline_808$$
      }
    }else {
      if("~" == $io$$inline_290_oper$$inline_291$$) {
        var $filterFunc$$inline_811$$ = $filterFunc$$inline_292$$, $retFunc$$inline_289$$ = function $$retFunc$$inline_289$$$($root$$inline_812_te$$inline_815$$, $ret$$inline_813$$, $bag$$inline_814$$) {
          for($root$$inline_812_te$$inline_815$$ = $root$$inline_812_te$$inline_815$$[$nSibling$$inline_125$$];$root$$inline_812_te$$inline_815$$;) {
            if($simpleNodeTest$$inline_127$$($root$$inline_812_te$$inline_815$$)) {
              if($bag$$inline_814$$ && !$_isUnique$$inline_150$$($root$$inline_812_te$$inline_815$$, $bag$$inline_814$$)) {
                break
              }
              $filterFunc$$inline_811$$($root$$inline_812_te$$inline_815$$) && $ret$$inline_813$$.push($root$$inline_812_te$$inline_815$$)
            }
            $root$$inline_812_te$$inline_815$$ = $root$$inline_812_te$$inline_815$$[$nSibling$$inline_125$$]
          }
          return $ret$$inline_813$$
        }
      }else {
        if(">" == $io$$inline_290_oper$$inline_291$$) {
          var $filterFunc$$inline_817$$ = $filterFunc$$inline_292$$, $filterFunc$$inline_817$$ = $filterFunc$$inline_817$$ || $goog$functions$TRUE$$, $retFunc$$inline_289$$ = function $$retFunc$$inline_289$$$($root$$inline_818_te$$inline_821$$, $ret$$inline_819$$, $bag$$inline_820$$) {
            for(var $x$$inline_822$$ = 0, $tret$$inline_823$$ = $root$$inline_818_te$$inline_821$$[$childNodesName$$inline_117$$];$root$$inline_818_te$$inline_821$$ = $tret$$inline_823$$[$x$$inline_822$$++];) {
              $simpleNodeTest$$inline_127$$($root$$inline_818_te$$inline_821$$) && ((!$bag$$inline_820$$ || $_isUnique$$inline_150$$($root$$inline_818_te$$inline_821$$, $bag$$inline_820$$)) && $filterFunc$$inline_817$$($root$$inline_818_te$$inline_821$$, $x$$inline_822$$)) && $ret$$inline_819$$.push($root$$inline_818_te$$inline_821$$)
            }
            return $ret$$inline_819$$
          }
        }
      }
    }
  }else {
    if($query$$inline_288$$.id) {
      $filterFunc$$inline_292$$ = !$query$$inline_288$$.$loops$ && $wildcardTag$$inline_293$$ ? $goog$functions$TRUE$$ : $getSimpleFilterFunc$$inline_135$$($query$$inline_288$$, {$el$:1, id:1}), $retFunc$$inline_289$$ = function $$retFunc$$inline_289$$$($root$$inline_297$$, $arr$$inline_298$$) {
        var $te$$inline_299$$ = $goog$dom$getDomHelper$$($root$$inline_297$$).$getElement$($query$$inline_288$$.id), $JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$;
        if($JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$ = $te$$inline_299$$ && $filterFunc$$inline_292$$($te$$inline_299$$)) {
          if(!($JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$ = 9 == $root$$inline_297$$.nodeType)) {
            for($JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$ = $te$$inline_299$$.parentNode;$JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$ && $JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$ != $root$$inline_297$$;) {
              $JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$ = $JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$.parentNode
            }
            $JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$ = !!$JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$
          }
        }
        if($JSCompiler_temp$$782_JSCompiler_temp$$783_pn$$inline_827$$) {
          return $getArr$$inline_115$$($te$$inline_299$$, $arr$$inline_298$$)
        }
      }
    }else {
      if($ecs$$inline_294_skipFilters$$inline_295$$ && /\{\s*\[native code\]\s*\}/.test(String($ecs$$inline_294_skipFilters$$inline_295$$)) && $query$$inline_288$$.$classes$.length && !$cssCaseBug$$inline_116$$) {
        var $filterFunc$$inline_292$$ = $getSimpleFilterFunc$$inline_135$$($query$$inline_288$$, {$el$:1, $classes$:1, id:1}), $classesString$$inline_296$$ = $query$$inline_288$$.$classes$.join(" "), $retFunc$$inline_289$$ = function $$retFunc$$inline_289$$$($root$$inline_300$$, $arr$$inline_301$$) {
          for(var $ret$$inline_302$$ = $getArr$$inline_115$$(0, $arr$$inline_301$$), $te$$inline_303$$, $x$$inline_304$$ = 0, $tret$$inline_305$$ = $root$$inline_300$$.getElementsByClassName($classesString$$inline_296$$);$te$$inline_303$$ = $tret$$inline_305$$[$x$$inline_304$$++];) {
            $filterFunc$$inline_292$$($te$$inline_303$$, $root$$inline_300$$) && $ret$$inline_302$$.push($te$$inline_303$$)
          }
          return $ret$$inline_302$$
        }
      }else {
        !$wildcardTag$$inline_293$$ && !$query$$inline_288$$.$loops$ ? $retFunc$$inline_289$$ = function $$retFunc$$inline_289$$$($root$$inline_306$$, $arr$$inline_307$$) {
          for(var $ret$$inline_308$$ = $getArr$$inline_115$$(0, $arr$$inline_307$$), $te$$inline_309$$, $x$$inline_310$$ = 0, $tret$$inline_311$$ = $root$$inline_306$$.getElementsByTagName($query$$inline_288$$.$getTag$());$te$$inline_309$$ = $tret$$inline_311$$[$x$$inline_310$$++];) {
            $ret$$inline_308$$.push($te$$inline_309$$)
          }
          return $ret$$inline_308$$
        } : ($filterFunc$$inline_292$$ = $getSimpleFilterFunc$$inline_135$$($query$$inline_288$$, {$el$:1, $tag$:1, id:1}), $retFunc$$inline_289$$ = function $$retFunc$$inline_289$$$($root$$inline_312$$, $arr$$inline_313$$) {
          for(var $ret$$inline_314$$ = $getArr$$inline_115$$(0, $arr$$inline_313$$), $te$$inline_315$$, $x$$inline_316$$ = 0, $tret$$inline_317$$ = $root$$inline_312$$.getElementsByTagName($query$$inline_288$$.$getTag$());$te$$inline_315$$ = $tret$$inline_317$$[$x$$inline_316$$++];) {
            $filterFunc$$inline_292$$($te$$inline_315$$, $root$$inline_312$$) && $ret$$inline_314$$.push($te$$inline_315$$)
          }
          return $ret$$inline_314$$
        })
      }
    }
  }
  return $_getElementsFuncCache$$inline_140$$[$query$$inline_288$$.$query$] = $retFunc$$inline_289$$
}
var $_queryFuncCacheDOM$$inline_143$$ = {}, $_queryFuncCacheQSA$$inline_144$$ = {};
function $getStepQueryFunc$$inline_145$$($query$$inline_330$$) {
  var $qparts$$inline_331$$ = $getQueryParts$$inline_119$$($goog$string$trim$$($query$$inline_330$$));
  if(1 == $qparts$$inline_331$$.length) {
    var $tef$$inline_332$$ = $getElementsFunc$$inline_141$$($qparts$$inline_331$$[0]);
    return function($r$$inline_334_root$$inline_333$$) {
      if($r$$inline_334_root$$inline_333$$ = $tef$$inline_332$$($r$$inline_334_root$$inline_333$$, [])) {
        $r$$inline_334_root$$inline_333$$.$nozip$ = $JSCompiler_alias_TRUE$$
      }
      return $r$$inline_334_root$$inline_333$$
    }
  }
  return function($candidates$$inline_831_root$$inline_335$$) {
    for(var $candidates$$inline_831_root$$inline_335$$ = $getArr$$inline_115$$($candidates$$inline_831_root$$inline_335$$), $qp$$inline_832_te$$inline_834$$, $gef$$inline_839_x$$inline_833$$, $qpl$$inline_835$$ = $qparts$$inline_331$$.length, $bag$$inline_836$$, $ret$$inline_837$$, $i$$inline_838$$ = 0;$i$$inline_838$$ < $qpl$$inline_835$$;$i$$inline_838$$++) {
      $ret$$inline_837$$ = [];
      $qp$$inline_832_te$$inline_834$$ = $qparts$$inline_331$$[$i$$inline_838$$];
      $gef$$inline_839_x$$inline_833$$ = $candidates$$inline_831_root$$inline_335$$.length - 1;
      0 < $gef$$inline_839_x$$inline_833$$ && ($bag$$inline_836$$ = {}, $ret$$inline_837$$.$nozip$ = $JSCompiler_alias_TRUE$$);
      $gef$$inline_839_x$$inline_833$$ = $getElementsFunc$$inline_141$$($qp$$inline_832_te$$inline_834$$);
      for(var $j$$inline_840$$ = 0;$qp$$inline_832_te$$inline_834$$ = $candidates$$inline_831_root$$inline_335$$[$j$$inline_840$$];$j$$inline_840$$++) {
        $gef$$inline_839_x$$inline_833$$($qp$$inline_832_te$$inline_834$$, $ret$$inline_837$$, $bag$$inline_836$$)
      }
      if(!$ret$$inline_837$$.length) {
        break
      }
      $candidates$$inline_831_root$$inline_335$$ = $ret$$inline_837$$
    }
    return $ret$$inline_837$$
  }
}
var $qsaAvail$$inline_146$$ = !!document.querySelectorAll && (!$goog$userAgent$WEBKIT$$ || $goog$userAgent$isVersion$$("526"));
function $getQueryFunc$$inline_147$$($query$$inline_336$$, $opt_forceDOM$$inline_337$$) {
  if($qsaAvail$$inline_146$$) {
    var $domCached$$inline_339_qcz$$inline_340_qsaCached$$inline_338$$ = $_queryFuncCacheQSA$$inline_144$$[$query$$inline_336$$];
    if($domCached$$inline_339_qcz$$inline_340_qsaCached$$inline_338$$ && !$opt_forceDOM$$inline_337$$) {
      return $domCached$$inline_339_qcz$$inline_340_qsaCached$$inline_338$$
    }
  }
  if($domCached$$inline_339_qcz$$inline_340_qsaCached$$inline_338$$ = $_queryFuncCacheDOM$$inline_143$$[$query$$inline_336$$]) {
    return $domCached$$inline_339_qcz$$inline_340_qsaCached$$inline_338$$
  }
  var $domCached$$inline_339_qcz$$inline_340_qsaCached$$inline_338$$ = $query$$inline_336$$.charAt(0), $nospace$$inline_341$$ = -1 == $query$$inline_336$$.indexOf(" ");
  0 <= $query$$inline_336$$.indexOf("#") && $nospace$$inline_341$$ && ($opt_forceDOM$$inline_337$$ = $JSCompiler_alias_TRUE$$);
  if($qsaAvail$$inline_146$$ && !$opt_forceDOM$$inline_337$$ && -1 == ">~+".indexOf($domCached$$inline_339_qcz$$inline_340_qsaCached$$inline_338$$) && (!$goog$userAgent$IE$$ || -1 == $query$$inline_336$$.indexOf(":")) && !($cssCaseBug$$inline_116$$ && 0 <= $query$$inline_336$$.indexOf(".")) && -1 == $query$$inline_336$$.indexOf(":contains") && -1 == $query$$inline_336$$.indexOf("|=")) {
    var $tq$$inline_342$$ = 0 <= ">~+".indexOf($query$$inline_336$$.charAt($query$$inline_336$$.length - 1)) ? $query$$inline_336$$ + " *" : $query$$inline_336$$;
    return $_queryFuncCacheQSA$$inline_144$$[$query$$inline_336$$] = function $$_queryFuncCacheQSA$$inline_144$$$$query$$inline_336$$$($root$$inline_344$$) {
      try {
        9 == $root$$inline_344$$.nodeType || $nospace$$inline_341$$ || $JSCompiler_alias_THROW$$("");
        var $r$$inline_345$$ = $root$$inline_344$$.querySelectorAll($tq$$inline_342$$);
        $goog$userAgent$IE$$ ? $r$$inline_345$$.$commentStrip$ = $JSCompiler_alias_TRUE$$ : $r$$inline_345$$.$nozip$ = $JSCompiler_alias_TRUE$$;
        return $r$$inline_345$$
      }catch($e$$inline_346$$) {
        return $getQueryFunc$$inline_147$$($query$$inline_336$$, $JSCompiler_alias_TRUE$$)($root$$inline_344$$)
      }
    }
  }
  var $parts$$inline_343$$ = $query$$inline_336$$.split(/\s*,\s*/);
  return $_queryFuncCacheDOM$$inline_143$$[$query$$inline_336$$] = 2 > $parts$$inline_343$$.length ? $getStepQueryFunc$$inline_145$$($query$$inline_336$$) : function($root$$inline_347$$) {
    for(var $pindex$$inline_348$$ = 0, $ret$$inline_349$$ = [], $tp$$inline_350$$;$tp$$inline_350$$ = $parts$$inline_343$$[$pindex$$inline_348$$++];) {
      $ret$$inline_349$$ = $ret$$inline_349$$.concat($getStepQueryFunc$$inline_145$$($tp$$inline_350$$)($root$$inline_347$$))
    }
    return $ret$$inline_349$$
  }
}
var $_zipIdx$$inline_148$$ = 0, $_nodeUID$$inline_149$$ = $goog$userAgent$IE$$ ? function($node$$inline_351$$) {
  return $caseSensitive$$inline_118$$ ? $node$$inline_351$$.getAttribute("_uid") || $node$$inline_351$$.setAttribute("_uid", ++$_zipIdx$$inline_148$$) || $_zipIdx$$inline_148$$ : $node$$inline_351$$.uniqueID
} : function($node$$inline_352$$) {
  return $node$$inline_352$$._uid || ($node$$inline_352$$._uid = ++$_zipIdx$$inline_148$$)
};
function $_isUnique$$inline_150$$($node$$inline_353$$, $bag$$inline_354$$) {
  if(!$bag$$inline_354$$) {
    return 1
  }
  var $id$$inline_355$$ = $_nodeUID$$inline_149$$($node$$inline_353$$);
  return!$bag$$inline_354$$[$id$$inline_355$$] ? $bag$$inline_354$$[$id$$inline_355$$] = 1 : 0
}
function $_zip$$inline_151$$($arr$$inline_356$$) {
  if($arr$$inline_356$$ && $arr$$inline_356$$.$nozip$) {
    return $arr$$inline_356$$
  }
  var $ret$$inline_357$$ = [];
  if(!$arr$$inline_356$$ || !$arr$$inline_356$$.length) {
    return $ret$$inline_357$$
  }
  $arr$$inline_356$$[0] && $ret$$inline_357$$.push($arr$$inline_356$$[0]);
  if(2 > $arr$$inline_356$$.length) {
    return $ret$$inline_357$$
  }
  $_zipIdx$$inline_148$$++;
  if($goog$userAgent$IE$$ && $caseSensitive$$inline_118$$) {
    var $szidx$$inline_358$$ = $_zipIdx$$inline_148$$ + "";
    $arr$$inline_356$$[0].setAttribute("_zipIdx", $szidx$$inline_358$$);
    for(var $x$$inline_359$$ = 1, $te$$inline_360$$;$te$$inline_360$$ = $arr$$inline_356$$[$x$$inline_359$$];$x$$inline_359$$++) {
      $arr$$inline_356$$[$x$$inline_359$$].getAttribute("_zipIdx") != $szidx$$inline_358$$ && $ret$$inline_357$$.push($te$$inline_360$$), $te$$inline_360$$.setAttribute("_zipIdx", $szidx$$inline_358$$)
    }
  }else {
    if($goog$userAgent$IE$$ && $arr$$inline_356$$.$commentStrip$) {
      try {
        for($x$$inline_359$$ = 1;$te$$inline_360$$ = $arr$$inline_356$$[$x$$inline_359$$];$x$$inline_359$$++) {
          $isElement$$inline_121$$($te$$inline_360$$) && $ret$$inline_357$$.push($te$$inline_360$$)
        }
      }catch($e$$inline_361$$) {
      }
    }else {
      $arr$$inline_356$$[0] && ($arr$$inline_356$$[0]._zipIdx = $_zipIdx$$inline_148$$);
      for($x$$inline_359$$ = 1;$te$$inline_360$$ = $arr$$inline_356$$[$x$$inline_359$$];$x$$inline_359$$++) {
        $arr$$inline_356$$[$x$$inline_359$$]._zipIdx != $_zipIdx$$inline_148$$ && $ret$$inline_357$$.push($te$$inline_360$$), $te$$inline_360$$._zipIdx = $_zipIdx$$inline_148$$
      }
    }
  }
  return $ret$$inline_357$$
}
function $query$$inline_152$$($query$$inline_362$$, $root$$inline_363$$) {
  if(!$query$$inline_362$$) {
    return[]
  }
  if($query$$inline_362$$.constructor == Array) {
    return $query$$inline_362$$
  }
  if(!$goog$isString$$($query$$inline_362$$)) {
    return[$query$$inline_362$$]
  }
  if($goog$isString$$($root$$inline_363$$) && ($root$$inline_363$$ = $goog$isString$$($root$$inline_363$$) ? document.getElementById($root$$inline_363$$) : $root$$inline_363$$, !$root$$inline_363$$)) {
    return[]
  }
  var $root$$inline_363$$ = $root$$inline_363$$ || document, $od$$inline_364_r$$inline_365$$ = $root$$inline_363$$.ownerDocument || $root$$inline_363$$.documentElement;
  $caseSensitive$$inline_118$$ = $root$$inline_363$$.contentType && "application/xml" == $root$$inline_363$$.contentType || $goog$userAgent$OPERA$$ && ($root$$inline_363$$.doctype || "[object XMLDocument]" == $od$$inline_364_r$$inline_365$$.toString()) || !!$od$$inline_364_r$$inline_365$$ && ($goog$userAgent$IE$$ ? $od$$inline_364_r$$inline_365$$.xml : $root$$inline_363$$.xmlVersion || $od$$inline_364_r$$inline_365$$.xmlVersion);
  return($od$$inline_364_r$$inline_365$$ = $getQueryFunc$$inline_147$$($query$$inline_362$$)($root$$inline_363$$)) && $od$$inline_364_r$$inline_365$$.$nozip$ ? $od$$inline_364_r$$inline_365$$ : $_zip$$inline_151$$($od$$inline_364_r$$inline_365$$)
}
$query$$inline_152$$.$pseudos$ = $pseudos$$inline_133$$;
$goog$exportPath_$$("goog.dom.query", $query$$inline_152$$);
$goog$exportPath_$$("goog.dom.query.pseudos", $query$$inline_152$$.$pseudos$);
var $goog$events$BrowserFeature$HAS_W3C_BUTTON$$ = !$goog$userAgent$IE$$ || $goog$userAgent$isDocumentMode$$(9), $goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$ = !$goog$userAgent$IE$$ || $goog$userAgent$isDocumentMode$$(9), $goog$events$BrowserFeature$SET_KEY_CODE_TO_PREVENT_DEFAULT$$ = $goog$userAgent$IE$$ && !$goog$userAgent$isVersion$$("9");
!$goog$userAgent$WEBKIT$$ || $goog$userAgent$isVersion$$("528");
$goog$userAgent$GECKO$$ && $goog$userAgent$isVersion$$("1.9b") || $goog$userAgent$IE$$ && $goog$userAgent$isVersion$$("8") || $goog$userAgent$OPERA$$ && $goog$userAgent$isVersion$$("9.5") || $goog$userAgent$WEBKIT$$ && $goog$userAgent$isVersion$$("528");
$goog$userAgent$GECKO$$ && !$goog$userAgent$isVersion$$("8") || $goog$userAgent$IE$$ && $goog$userAgent$isVersion$$("9");
function $goog$Disposable$$() {
  0 != $goog$Disposable$MonitoringMode$OFF$$ && (this.$creationStack$ = Error().stack, $goog$getUid$$(this))
}
var $goog$Disposable$MonitoringMode$OFF$$ = 0;
$goog$Disposable$$.prototype.$disposed_$ = $JSCompiler_alias_FALSE$$;
function $goog$events$Event$$($type$$55$$, $opt_target$$1$$) {
  this.type = $type$$55$$;
  this.currentTarget = this.target = $opt_target$$1$$
}
$JSCompiler_prototypeAlias$$ = $goog$events$Event$$.prototype;
$JSCompiler_prototypeAlias$$.$propagationStopped_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.defaultPrevented = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$returnValue_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.stopPropagation = function $$JSCompiler_prototypeAlias$$$stopPropagation$() {
  this.$propagationStopped_$ = $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.preventDefault = function $$JSCompiler_prototypeAlias$$$preventDefault$() {
  this.defaultPrevented = $JSCompiler_alias_TRUE$$;
  this.$returnValue_$ = $JSCompiler_alias_FALSE$$
};
function $goog$events$Event$preventDefault$$($e$$15$$) {
  $e$$15$$.preventDefault()
}
;function $goog$reflect$sinkValue$$($x$$67$$) {
  $goog$reflect$sinkValue$$[" "]($x$$67$$);
  return $x$$67$$
}
$goog$reflect$sinkValue$$[" "] = $goog$nullFunction$$;
function $goog$events$BrowserEvent$$($opt_e$$, $opt_currentTarget$$) {
  $opt_e$$ && this.init($opt_e$$, $opt_currentTarget$$)
}
$goog$inherits$$($goog$events$BrowserEvent$$, $goog$events$Event$$);
var $goog$events$BrowserEvent$IEButtonMap$$ = [1, 4, 2];
$JSCompiler_prototypeAlias$$ = $goog$events$BrowserEvent$$.prototype;
$JSCompiler_prototypeAlias$$.target = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.relatedTarget = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.offsetX = 0;
$JSCompiler_prototypeAlias$$.offsetY = 0;
$JSCompiler_prototypeAlias$$.clientX = 0;
$JSCompiler_prototypeAlias$$.clientY = 0;
$JSCompiler_prototypeAlias$$.screenX = 0;
$JSCompiler_prototypeAlias$$.screenY = 0;
$JSCompiler_prototypeAlias$$.button = 0;
$JSCompiler_prototypeAlias$$.keyCode = 0;
$JSCompiler_prototypeAlias$$.charCode = 0;
$JSCompiler_prototypeAlias$$.ctrlKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.altKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.shiftKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.metaKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$platformModifierKey$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$event_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.init = function $$JSCompiler_prototypeAlias$$$init$($e$$17$$, $opt_currentTarget$$1$$) {
  var $type$$57$$ = this.type = $e$$17$$.type;
  $goog$events$Event$$.call(this, $type$$57$$);
  this.target = $e$$17$$.target || $e$$17$$.srcElement;
  this.currentTarget = $opt_currentTarget$$1$$;
  var $relatedTarget$$ = $e$$17$$.relatedTarget;
  if($relatedTarget$$) {
    if($goog$userAgent$GECKO$$) {
      var $JSCompiler_inline_result$$46$$;
      a: {
        try {
          $goog$reflect$sinkValue$$($relatedTarget$$.nodeName);
          $JSCompiler_inline_result$$46$$ = $JSCompiler_alias_TRUE$$;
          break a
        }catch($e$$inline_377$$) {
        }
        $JSCompiler_inline_result$$46$$ = $JSCompiler_alias_FALSE$$
      }
      $JSCompiler_inline_result$$46$$ || ($relatedTarget$$ = $JSCompiler_alias_NULL$$)
    }
  }else {
    "mouseover" == $type$$57$$ ? $relatedTarget$$ = $e$$17$$.fromElement : "mouseout" == $type$$57$$ && ($relatedTarget$$ = $e$$17$$.toElement)
  }
  this.relatedTarget = $relatedTarget$$;
  this.offsetX = $goog$userAgent$WEBKIT$$ || $e$$17$$.offsetX !== $JSCompiler_alias_VOID$$ ? $e$$17$$.offsetX : $e$$17$$.layerX;
  this.offsetY = $goog$userAgent$WEBKIT$$ || $e$$17$$.offsetY !== $JSCompiler_alias_VOID$$ ? $e$$17$$.offsetY : $e$$17$$.layerY;
  this.clientX = $e$$17$$.clientX !== $JSCompiler_alias_VOID$$ ? $e$$17$$.clientX : $e$$17$$.pageX;
  this.clientY = $e$$17$$.clientY !== $JSCompiler_alias_VOID$$ ? $e$$17$$.clientY : $e$$17$$.pageY;
  this.screenX = $e$$17$$.screenX || 0;
  this.screenY = $e$$17$$.screenY || 0;
  this.button = $e$$17$$.button;
  this.keyCode = $e$$17$$.keyCode || 0;
  this.charCode = $e$$17$$.charCode || ("keypress" == $type$$57$$ ? $e$$17$$.keyCode : 0);
  this.ctrlKey = $e$$17$$.ctrlKey;
  this.altKey = $e$$17$$.altKey;
  this.shiftKey = $e$$17$$.shiftKey;
  this.metaKey = $e$$17$$.metaKey;
  this.$platformModifierKey$ = $goog$userAgent$detectedMac_$$ ? $e$$17$$.metaKey : $e$$17$$.ctrlKey;
  this.state = $e$$17$$.state;
  this.$event_$ = $e$$17$$;
  $e$$17$$.defaultPrevented && this.preventDefault();
  delete this.$propagationStopped_$
};
function $JSCompiler_StaticMethods_isMouseActionButton$$($JSCompiler_StaticMethods_isMouseActionButton$self$$) {
  return($goog$events$BrowserFeature$HAS_W3C_BUTTON$$ ? 0 == $JSCompiler_StaticMethods_isMouseActionButton$self$$.$event_$.button : "click" == $JSCompiler_StaticMethods_isMouseActionButton$self$$.type ? $JSCompiler_alias_TRUE$$ : !!($JSCompiler_StaticMethods_isMouseActionButton$self$$.$event_$.button & $goog$events$BrowserEvent$IEButtonMap$$[0])) && !($goog$userAgent$WEBKIT$$ && $goog$userAgent$detectedMac_$$ && $JSCompiler_StaticMethods_isMouseActionButton$self$$.ctrlKey)
}
$JSCompiler_prototypeAlias$$.stopPropagation = function $$JSCompiler_prototypeAlias$$$stopPropagation$() {
  $goog$events$BrowserEvent$$.$superClass_$.stopPropagation.call(this);
  this.$event_$.stopPropagation ? this.$event_$.stopPropagation() : this.$event_$.cancelBubble = $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.preventDefault = function $$JSCompiler_prototypeAlias$$$preventDefault$() {
  $goog$events$BrowserEvent$$.$superClass_$.preventDefault.call(this);
  var $be$$ = this.$event_$;
  if($be$$.preventDefault) {
    $be$$.preventDefault()
  }else {
    if($be$$.returnValue = $JSCompiler_alias_FALSE$$, $goog$events$BrowserFeature$SET_KEY_CODE_TO_PREVENT_DEFAULT$$) {
      try {
        if($be$$.ctrlKey || 112 <= $be$$.keyCode && 123 >= $be$$.keyCode) {
          $be$$.keyCode = -1
        }
      }catch($ex$$1$$) {
      }
    }
  }
};
$JSCompiler_prototypeAlias$$.$getBrowserEvent$ = $JSCompiler_get$$("$event_$");
function $goog$events$Listener$$() {
}
var $goog$events$Listener$counter_$$ = 0;
$JSCompiler_prototypeAlias$$ = $goog$events$Listener$$.prototype;
$JSCompiler_prototypeAlias$$.key = 0;
$JSCompiler_prototypeAlias$$.$removed$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$callOnce$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.init = function $$JSCompiler_prototypeAlias$$$init$($listener$$32$$, $proxy$$, $src$$6$$, $type$$58$$, $capture$$, $opt_handler$$) {
  $goog$isFunction$$($listener$$32$$) ? this.$isFunctionListener_$ = $JSCompiler_alias_TRUE$$ : $listener$$32$$ && $listener$$32$$.handleEvent && $goog$isFunction$$($listener$$32$$.handleEvent) ? this.$isFunctionListener_$ = $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_THROW$$(Error("Invalid listener argument"));
  this.$listener$ = $listener$$32$$;
  this.$proxy$ = $proxy$$;
  this.src = $src$$6$$;
  this.type = $type$$58$$;
  this.capture = !!$capture$$;
  this.$handler$ = $opt_handler$$;
  this.$callOnce$ = $JSCompiler_alias_FALSE$$;
  this.key = ++$goog$events$Listener$counter_$$;
  this.$removed$ = $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.handleEvent = function $$JSCompiler_prototypeAlias$$$handleEvent$($eventObject$$) {
  return this.$isFunctionListener_$ ? this.$listener$.call(this.$handler$ || this.src, $eventObject$$) : this.$listener$.handleEvent.call(this.$listener$, $eventObject$$)
};
var $goog$events$listeners_$$ = {}, $goog$events$listenerTree_$$ = {}, $goog$events$sources_$$ = {}, $goog$events$onStringMap_$$ = {};
function $goog$events$listen$$($src$$7$$, $type$$59$$, $key$$43_listener$$33$$, $capture$$1_opt_capt$$2$$, $opt_handler$$1$$) {
  if($type$$59$$) {
    if($goog$isArray$$($type$$59$$)) {
      for(var $i$$67_proxy$$1$$ = 0;$i$$67_proxy$$1$$ < $type$$59$$.length;$i$$67_proxy$$1$$++) {
        $goog$events$listen$$($src$$7$$, $type$$59$$[$i$$67_proxy$$1$$], $key$$43_listener$$33$$, $capture$$1_opt_capt$$2$$, $opt_handler$$1$$)
      }
      return $JSCompiler_alias_NULL$$
    }
    var $capture$$1_opt_capt$$2$$ = !!$capture$$1_opt_capt$$2$$, $listenerObj_map$$ = $goog$events$listenerTree_$$;
    $type$$59$$ in $listenerObj_map$$ || ($listenerObj_map$$[$type$$59$$] = {$count_$:0, $remaining_$:0});
    $listenerObj_map$$ = $listenerObj_map$$[$type$$59$$];
    $capture$$1_opt_capt$$2$$ in $listenerObj_map$$ || ($listenerObj_map$$[$capture$$1_opt_capt$$2$$] = {$count_$:0, $remaining_$:0}, $listenerObj_map$$.$count_$++);
    var $listenerObj_map$$ = $listenerObj_map$$[$capture$$1_opt_capt$$2$$], $srcUid$$ = $goog$getUid$$($src$$7$$), $listenerArray$$;
    $listenerObj_map$$.$remaining_$++;
    if($listenerObj_map$$[$srcUid$$]) {
      $listenerArray$$ = $listenerObj_map$$[$srcUid$$];
      for($i$$67_proxy$$1$$ = 0;$i$$67_proxy$$1$$ < $listenerArray$$.length;$i$$67_proxy$$1$$++) {
        if($listenerObj_map$$ = $listenerArray$$[$i$$67_proxy$$1$$], $listenerObj_map$$.$listener$ == $key$$43_listener$$33$$ && $listenerObj_map$$.$handler$ == $opt_handler$$1$$) {
          if($listenerObj_map$$.$removed$) {
            break
          }
          return $listenerArray$$[$i$$67_proxy$$1$$].key
        }
      }
    }else {
      $listenerArray$$ = $listenerObj_map$$[$srcUid$$] = [], $listenerObj_map$$.$count_$++
    }
    var $proxyCallbackFunction$$inline_382$$ = $goog$events$handleBrowserEvent_$$, $f$$inline_383$$ = $goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$ ? function($eventObject$$inline_384$$) {
      return $proxyCallbackFunction$$inline_382$$.call($f$$inline_383$$.src, $f$$inline_383$$.key, $eventObject$$inline_384$$)
    } : function($eventObject$$inline_385_v$$inline_386$$) {
      $eventObject$$inline_385_v$$inline_386$$ = $proxyCallbackFunction$$inline_382$$.call($f$$inline_383$$.src, $f$$inline_383$$.key, $eventObject$$inline_385_v$$inline_386$$);
      if(!$eventObject$$inline_385_v$$inline_386$$) {
        return $eventObject$$inline_385_v$$inline_386$$
      }
    }, $i$$67_proxy$$1$$ = $f$$inline_383$$;
    $i$$67_proxy$$1$$.src = $src$$7$$;
    $listenerObj_map$$ = new $goog$events$Listener$$;
    $listenerObj_map$$.init($key$$43_listener$$33$$, $i$$67_proxy$$1$$, $src$$7$$, $type$$59$$, $capture$$1_opt_capt$$2$$, $opt_handler$$1$$);
    $key$$43_listener$$33$$ = $listenerObj_map$$.key;
    $i$$67_proxy$$1$$.key = $key$$43_listener$$33$$;
    $listenerArray$$.push($listenerObj_map$$);
    $goog$events$listeners_$$[$key$$43_listener$$33$$] = $listenerObj_map$$;
    $goog$events$sources_$$[$srcUid$$] || ($goog$events$sources_$$[$srcUid$$] = []);
    $goog$events$sources_$$[$srcUid$$].push($listenerObj_map$$);
    $src$$7$$.addEventListener ? ($src$$7$$ == $goog$global$$ || !$src$$7$$.$customEvent_$) && $src$$7$$.addEventListener($type$$59$$, $i$$67_proxy$$1$$, $capture$$1_opt_capt$$2$$) : $src$$7$$.attachEvent($type$$59$$ in $goog$events$onStringMap_$$ ? $goog$events$onStringMap_$$[$type$$59$$] : $goog$events$onStringMap_$$[$type$$59$$] = "on" + $type$$59$$, $i$$67_proxy$$1$$);
    return $key$$43_listener$$33$$
  }
  $JSCompiler_alias_THROW$$(Error("Invalid event type"))
}
function $goog$events$unlisten$$($listenerArray$$1_src$$10$$, $type$$61$$, $listener$$36$$, $capture$$2_opt_capt$$5$$, $opt_handler$$4$$) {
  if($goog$isArray$$($type$$61$$)) {
    for(var $i$$69$$ = 0;$i$$69$$ < $type$$61$$.length;$i$$69$$++) {
      $goog$events$unlisten$$($listenerArray$$1_src$$10$$, $type$$61$$[$i$$69$$], $listener$$36$$, $capture$$2_opt_capt$$5$$, $opt_handler$$4$$)
    }
  }else {
    if($capture$$2_opt_capt$$5$$ = !!$capture$$2_opt_capt$$5$$, $listenerArray$$1_src$$10$$ = $goog$events$getListeners_$$($listenerArray$$1_src$$10$$, $type$$61$$, $capture$$2_opt_capt$$5$$)) {
      for($i$$69$$ = 0;$i$$69$$ < $listenerArray$$1_src$$10$$.length;$i$$69$$++) {
        if($listenerArray$$1_src$$10$$[$i$$69$$].$listener$ == $listener$$36$$ && $listenerArray$$1_src$$10$$[$i$$69$$].capture == $capture$$2_opt_capt$$5$$ && $listenerArray$$1_src$$10$$[$i$$69$$].$handler$ == $opt_handler$$4$$) {
          $goog$events$unlistenByKey$$($listenerArray$$1_src$$10$$[$i$$69$$].key);
          break
        }
      }
    }
  }
}
function $goog$events$unlistenByKey$$($key$$45$$) {
  if(!$goog$events$listeners_$$[$key$$45$$]) {
    return $JSCompiler_alias_FALSE$$
  }
  var $listener$$37_listenerArray$$2$$ = $goog$events$listeners_$$[$key$$45$$];
  if($listener$$37_listenerArray$$2$$.$removed$) {
    return $JSCompiler_alias_FALSE$$
  }
  var $src$$11_srcUid$$1$$ = $listener$$37_listenerArray$$2$$.src, $type$$62$$ = $listener$$37_listenerArray$$2$$.type, $proxy$$2_sourcesArray$$ = $listener$$37_listenerArray$$2$$.$proxy$, $capture$$3$$ = $listener$$37_listenerArray$$2$$.capture;
  $src$$11_srcUid$$1$$.removeEventListener ? ($src$$11_srcUid$$1$$ == $goog$global$$ || !$src$$11_srcUid$$1$$.$customEvent_$) && $src$$11_srcUid$$1$$.removeEventListener($type$$62$$, $proxy$$2_sourcesArray$$, $capture$$3$$) : $src$$11_srcUid$$1$$.detachEvent && $src$$11_srcUid$$1$$.detachEvent($type$$62$$ in $goog$events$onStringMap_$$ ? $goog$events$onStringMap_$$[$type$$62$$] : $goog$events$onStringMap_$$[$type$$62$$] = "on" + $type$$62$$, $proxy$$2_sourcesArray$$);
  $src$$11_srcUid$$1$$ = $goog$getUid$$($src$$11_srcUid$$1$$);
  $goog$events$sources_$$[$src$$11_srcUid$$1$$] && ($proxy$$2_sourcesArray$$ = $goog$events$sources_$$[$src$$11_srcUid$$1$$], $goog$array$remove$$($proxy$$2_sourcesArray$$, $listener$$37_listenerArray$$2$$), 0 == $proxy$$2_sourcesArray$$.length && delete $goog$events$sources_$$[$src$$11_srcUid$$1$$]);
  $listener$$37_listenerArray$$2$$.$removed$ = $JSCompiler_alias_TRUE$$;
  if($listener$$37_listenerArray$$2$$ = $goog$events$listenerTree_$$[$type$$62$$][$capture$$3$$][$src$$11_srcUid$$1$$]) {
    $listener$$37_listenerArray$$2$$.$needsCleanup_$ = $JSCompiler_alias_TRUE$$, $goog$events$cleanUp_$$($type$$62$$, $capture$$3$$, $src$$11_srcUid$$1$$, $listener$$37_listenerArray$$2$$)
  }
  delete $goog$events$listeners_$$[$key$$45$$];
  return $JSCompiler_alias_TRUE$$
}
function $goog$events$cleanUp_$$($type$$63$$, $capture$$4$$, $srcUid$$2$$, $listenerArray$$3$$) {
  if(!$listenerArray$$3$$.$locked_$ && $listenerArray$$3$$.$needsCleanup_$) {
    for(var $oldIndex$$ = 0, $newIndex$$ = 0;$oldIndex$$ < $listenerArray$$3$$.length;$oldIndex$$++) {
      $listenerArray$$3$$[$oldIndex$$].$removed$ ? $listenerArray$$3$$[$oldIndex$$].$proxy$.src = $JSCompiler_alias_NULL$$ : ($oldIndex$$ != $newIndex$$ && ($listenerArray$$3$$[$newIndex$$] = $listenerArray$$3$$[$oldIndex$$]), $newIndex$$++)
    }
    $listenerArray$$3$$.length = $newIndex$$;
    $listenerArray$$3$$.$needsCleanup_$ = $JSCompiler_alias_FALSE$$;
    0 == $newIndex$$ && (delete $goog$events$listenerTree_$$[$type$$63$$][$capture$$4$$][$srcUid$$2$$], $goog$events$listenerTree_$$[$type$$63$$][$capture$$4$$].$count_$--, 0 == $goog$events$listenerTree_$$[$type$$63$$][$capture$$4$$].$count_$ && (delete $goog$events$listenerTree_$$[$type$$63$$][$capture$$4$$], $goog$events$listenerTree_$$[$type$$63$$].$count_$--), 0 == $goog$events$listenerTree_$$[$type$$63$$].$count_$ && delete $goog$events$listenerTree_$$[$type$$63$$])
  }
}
function $goog$events$getListeners_$$($obj$$66_objUid$$, $type$$65$$, $capture$$6$$) {
  var $map$$1$$ = $goog$events$listenerTree_$$;
  return $type$$65$$ in $map$$1$$ && ($map$$1$$ = $map$$1$$[$type$$65$$], $capture$$6$$ in $map$$1$$ && ($map$$1$$ = $map$$1$$[$capture$$6$$], $obj$$66_objUid$$ = $goog$getUid$$($obj$$66_objUid$$), $map$$1$$[$obj$$66_objUid$$])) ? $map$$1$$[$obj$$66_objUid$$] : $JSCompiler_alias_NULL$$
}
function $goog$events$fireListeners_$$($listenerArray$$5_map$$4$$, $obj$$69_objUid$$2$$, $type$$69$$, $capture$$9$$, $eventObject$$4$$) {
  var $retval$$ = 1, $obj$$69_objUid$$2$$ = $goog$getUid$$($obj$$69_objUid$$2$$);
  if($listenerArray$$5_map$$4$$[$obj$$69_objUid$$2$$]) {
    $listenerArray$$5_map$$4$$.$remaining_$--;
    $listenerArray$$5_map$$4$$ = $listenerArray$$5_map$$4$$[$obj$$69_objUid$$2$$];
    $listenerArray$$5_map$$4$$.$locked_$ ? $listenerArray$$5_map$$4$$.$locked_$++ : $listenerArray$$5_map$$4$$.$locked_$ = 1;
    try {
      for(var $length$$20$$ = $listenerArray$$5_map$$4$$.length, $i$$73$$ = 0;$i$$73$$ < $length$$20$$;$i$$73$$++) {
        var $listener$$43$$ = $listenerArray$$5_map$$4$$[$i$$73$$];
        $listener$$43$$ && !$listener$$43$$.$removed$ && ($retval$$ &= $goog$events$fireListener$$($listener$$43$$, $eventObject$$4$$) !== $JSCompiler_alias_FALSE$$)
      }
    }finally {
      $listenerArray$$5_map$$4$$.$locked_$--, $goog$events$cleanUp_$$($type$$69$$, $capture$$9$$, $obj$$69_objUid$$2$$, $listenerArray$$5_map$$4$$)
    }
  }
  return Boolean($retval$$)
}
function $goog$events$fireListener$$($listener$$44$$, $eventObject$$5$$) {
  $listener$$44$$.$callOnce$ && $goog$events$unlistenByKey$$($listener$$44$$.key);
  return $listener$$44$$.handleEvent($eventObject$$5$$)
}
function $goog$events$handleBrowserEvent_$$($key$$47$$, $opt_evt$$) {
  if(!$goog$events$listeners_$$[$key$$47$$]) {
    return $JSCompiler_alias_TRUE$$
  }
  var $listener$$45$$ = $goog$events$listeners_$$[$key$$47$$], $be$$1_type$$71$$ = $listener$$45$$.type, $map$$6$$ = $goog$events$listenerTree_$$;
  if(!($be$$1_type$$71$$ in $map$$6$$)) {
    return $JSCompiler_alias_TRUE$$
  }
  var $map$$6$$ = $map$$6$$[$be$$1_type$$71$$], $ieEvent_part$$inline_392_retval$$1$$, $targetsMap$$1$$;
  if(!$goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$) {
    var $JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$;
    if(!($JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$ = $opt_evt$$)) {
      a: {
        $JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$ = ["window", "event"];
        for(var $cur$$inline_391_hasBubble$$1$$ = $goog$global$$;$ieEvent_part$$inline_392_retval$$1$$ = $JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$.shift();) {
          if($cur$$inline_391_hasBubble$$1$$[$ieEvent_part$$inline_392_retval$$1$$] != $JSCompiler_alias_NULL$$) {
            $cur$$inline_391_hasBubble$$1$$ = $cur$$inline_391_hasBubble$$1$$[$ieEvent_part$$inline_392_retval$$1$$]
          }else {
            $JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$ = $JSCompiler_alias_NULL$$;
            break a
          }
        }
        $JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$ = $cur$$inline_391_hasBubble$$1$$
      }
    }
    $ieEvent_part$$inline_392_retval$$1$$ = $JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$;
    $JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$ = $JSCompiler_alias_TRUE$$ in $map$$6$$;
    $cur$$inline_391_hasBubble$$1$$ = $JSCompiler_alias_FALSE$$ in $map$$6$$;
    if($JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$) {
      if(0 > $ieEvent_part$$inline_392_retval$$1$$.keyCode || $ieEvent_part$$inline_392_retval$$1$$.returnValue != $JSCompiler_alias_VOID$$) {
        return $JSCompiler_alias_TRUE$$
      }
      a: {
        var $evt$$15_useReturnValue$$inline_395$$ = $JSCompiler_alias_FALSE$$;
        if(0 == $ieEvent_part$$inline_392_retval$$1$$.keyCode) {
          try {
            $ieEvent_part$$inline_392_retval$$1$$.keyCode = -1;
            break a
          }catch($ex$$inline_396$$) {
            $evt$$15_useReturnValue$$inline_395$$ = $JSCompiler_alias_TRUE$$
          }
        }
        if($evt$$15_useReturnValue$$inline_395$$ || $ieEvent_part$$inline_392_retval$$1$$.returnValue == $JSCompiler_alias_VOID$$) {
          $ieEvent_part$$inline_392_retval$$1$$.returnValue = $JSCompiler_alias_TRUE$$
        }
      }
    }
    $evt$$15_useReturnValue$$inline_395$$ = new $goog$events$BrowserEvent$$;
    $evt$$15_useReturnValue$$inline_395$$.init($ieEvent_part$$inline_392_retval$$1$$, this);
    $ieEvent_part$$inline_392_retval$$1$$ = $JSCompiler_alias_TRUE$$;
    try {
      if($JSCompiler_temp$$22_hasCapture$$2_parts$$inline_390$$) {
        for(var $ancestors$$2$$ = [], $parent$$17$$ = $evt$$15_useReturnValue$$inline_395$$.currentTarget;$parent$$17$$;$parent$$17$$ = $parent$$17$$.parentNode) {
          $ancestors$$2$$.push($parent$$17$$)
        }
        $targetsMap$$1$$ = $map$$6$$[$JSCompiler_alias_TRUE$$];
        $targetsMap$$1$$.$remaining_$ = $targetsMap$$1$$.$count_$;
        for(var $i$$75$$ = $ancestors$$2$$.length - 1;!$evt$$15_useReturnValue$$inline_395$$.$propagationStopped_$ && 0 <= $i$$75$$ && $targetsMap$$1$$.$remaining_$;$i$$75$$--) {
          $evt$$15_useReturnValue$$inline_395$$.currentTarget = $ancestors$$2$$[$i$$75$$], $ieEvent_part$$inline_392_retval$$1$$ &= $goog$events$fireListeners_$$($targetsMap$$1$$, $ancestors$$2$$[$i$$75$$], $be$$1_type$$71$$, $JSCompiler_alias_TRUE$$, $evt$$15_useReturnValue$$inline_395$$)
        }
        if($cur$$inline_391_hasBubble$$1$$) {
          $targetsMap$$1$$ = $map$$6$$[$JSCompiler_alias_FALSE$$];
          $targetsMap$$1$$.$remaining_$ = $targetsMap$$1$$.$count_$;
          for($i$$75$$ = 0;!$evt$$15_useReturnValue$$inline_395$$.$propagationStopped_$ && $i$$75$$ < $ancestors$$2$$.length && $targetsMap$$1$$.$remaining_$;$i$$75$$++) {
            $evt$$15_useReturnValue$$inline_395$$.currentTarget = $ancestors$$2$$[$i$$75$$], $ieEvent_part$$inline_392_retval$$1$$ &= $goog$events$fireListeners_$$($targetsMap$$1$$, $ancestors$$2$$[$i$$75$$], $be$$1_type$$71$$, $JSCompiler_alias_FALSE$$, $evt$$15_useReturnValue$$inline_395$$)
          }
        }
      }else {
        $ieEvent_part$$inline_392_retval$$1$$ = $goog$events$fireListener$$($listener$$45$$, $evt$$15_useReturnValue$$inline_395$$)
      }
    }finally {
      $ancestors$$2$$ && ($ancestors$$2$$.length = 0)
    }
    return $ieEvent_part$$inline_392_retval$$1$$
  }
  $be$$1_type$$71$$ = new $goog$events$BrowserEvent$$($opt_evt$$, this);
  return $ieEvent_part$$inline_392_retval$$1$$ = $goog$events$fireListener$$($listener$$45$$, $be$$1_type$$71$$)
}
;function $goog$events$EventHandler$$($opt_handler$$7$$) {
  $goog$Disposable$$.call(this);
  this.$handler_$ = $opt_handler$$7$$;
  this.$keys_$ = []
}
$goog$inherits$$($goog$events$EventHandler$$, $goog$Disposable$$);
var $goog$events$EventHandler$typeArray_$$ = [];
function $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$self$$, $src$$15$$, $type$$72$$, $opt_fn$$, $opt_capture$$1$$) {
  $goog$isArray$$($type$$72$$) || ($goog$events$EventHandler$typeArray_$$[0] = $type$$72$$, $type$$72$$ = $goog$events$EventHandler$typeArray_$$);
  for(var $i$$76$$ = 0;$i$$76$$ < $type$$72$$.length;$i$$76$$++) {
    var $key$$48$$ = $goog$events$listen$$($src$$15$$, $type$$72$$[$i$$76$$], $opt_fn$$ || $JSCompiler_StaticMethods_listen$self$$, $opt_capture$$1$$ || $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_listen$self$$.$handler_$ || $JSCompiler_StaticMethods_listen$self$$);
    $JSCompiler_StaticMethods_listen$self$$.$keys_$.push($key$$48$$)
  }
  return $JSCompiler_StaticMethods_listen$self$$
}
function $JSCompiler_StaticMethods_unlisten$$($JSCompiler_StaticMethods_unlisten$self$$, $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$, $i$$inline_406_type$$74$$, $listener$$inline_401_opt_fn$$2$$, $capture$$inline_404_opt_capture$$3$$, $opt_handler$$11_opt_handler$$inline_403$$) {
  if($goog$isArray$$($i$$inline_406_type$$74$$)) {
    for(var $i$$78$$ = 0;$i$$78$$ < $i$$inline_406_type$$74$$.length;$i$$78$$++) {
      $JSCompiler_StaticMethods_unlisten$$($JSCompiler_StaticMethods_unlisten$self$$, $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$, $i$$inline_406_type$$74$$[$i$$78$$], $listener$$inline_401_opt_fn$$2$$, $capture$$inline_404_opt_capture$$3$$, $opt_handler$$11_opt_handler$$inline_403$$)
    }
  }else {
    a: {
      $listener$$inline_401_opt_fn$$2$$ = $listener$$inline_401_opt_fn$$2$$ || $JSCompiler_StaticMethods_unlisten$self$$;
      $opt_handler$$11_opt_handler$$inline_403$$ = $opt_handler$$11_opt_handler$$inline_403$$ || $JSCompiler_StaticMethods_unlisten$self$$.$handler_$ || $JSCompiler_StaticMethods_unlisten$self$$;
      $capture$$inline_404_opt_capture$$3$$ = !!$capture$$inline_404_opt_capture$$3$$;
      if($key$$50_listener$$47_listenerArray$$inline_405_src$$18$$ = $goog$events$getListeners_$$($key$$50_listener$$47_listenerArray$$inline_405_src$$18$$, $i$$inline_406_type$$74$$, $capture$$inline_404_opt_capture$$3$$)) {
        for($i$$inline_406_type$$74$$ = 0;$i$$inline_406_type$$74$$ < $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$.length;$i$$inline_406_type$$74$$++) {
          if(!$key$$50_listener$$47_listenerArray$$inline_405_src$$18$$[$i$$inline_406_type$$74$$].$removed$ && $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$[$i$$inline_406_type$$74$$].$listener$ == $listener$$inline_401_opt_fn$$2$$ && $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$[$i$$inline_406_type$$74$$].capture == $capture$$inline_404_opt_capture$$3$$ && $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$[$i$$inline_406_type$$74$$].$handler$ == $opt_handler$$11_opt_handler$$inline_403$$) {
            $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$ = $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$[$i$$inline_406_type$$74$$];
            break a
          }
        }
      }
      $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$ = $JSCompiler_alias_NULL$$
    }
    $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$ && ($key$$50_listener$$47_listenerArray$$inline_405_src$$18$$ = $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$.key, $goog$events$unlistenByKey$$($key$$50_listener$$47_listenerArray$$inline_405_src$$18$$), $goog$array$remove$$($JSCompiler_StaticMethods_unlisten$self$$.$keys_$, $key$$50_listener$$47_listenerArray$$inline_405_src$$18$$))
  }
  return $JSCompiler_StaticMethods_unlisten$self$$
}
$goog$events$EventHandler$$.prototype.$removeAll$ = function $$goog$events$EventHandler$$$$$removeAll$$() {
  $goog$array$forEach$$(this.$keys_$, $goog$events$unlistenByKey$$);
  this.$keys_$.length = 0
};
$goog$events$EventHandler$$.prototype.handleEvent = function $$goog$events$EventHandler$$$$handleEvent$() {
  $JSCompiler_alias_THROW$$(Error("EventHandler.handleEvent not implemented"))
};
function $goog$events$EventTarget$$() {
  $goog$Disposable$$.call(this)
}
$goog$inherits$$($goog$events$EventTarget$$, $goog$Disposable$$);
$JSCompiler_prototypeAlias$$ = $goog$events$EventTarget$$.prototype;
$JSCompiler_prototypeAlias$$.$customEvent_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.$parentEventTarget_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$setParentEventTarget$ = function $$JSCompiler_prototypeAlias$$$$setParentEventTarget$$($parent$$18$$) {
  this.$parentEventTarget_$ = $parent$$18$$
};
$JSCompiler_prototypeAlias$$.addEventListener = function $$JSCompiler_prototypeAlias$$$addEventListener$($type$$75$$, $handler$$3$$, $opt_capture$$4$$, $opt_handlerScope$$) {
  $goog$events$listen$$(this, $type$$75$$, $handler$$3$$, $opt_capture$$4$$, $opt_handlerScope$$)
};
$JSCompiler_prototypeAlias$$.removeEventListener = function $$JSCompiler_prototypeAlias$$$removeEventListener$($type$$76$$, $handler$$4$$, $opt_capture$$5$$, $opt_handlerScope$$1$$) {
  $goog$events$unlisten$$(this, $type$$76$$, $handler$$4$$, $opt_capture$$5$$, $opt_handlerScope$$1$$)
};
$JSCompiler_prototypeAlias$$.dispatchEvent = function $$JSCompiler_prototypeAlias$$$dispatchEvent$($JSCompiler_inline_result$$26_e$$23_e$$inline_409$$) {
  var $hasCapture$$inline_415_type$$inline_410$$ = $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.type || $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$, $map$$inline_411$$ = $goog$events$listenerTree_$$;
  if($hasCapture$$inline_415_type$$inline_410$$ in $map$$inline_411$$) {
    if($goog$isString$$($JSCompiler_inline_result$$26_e$$23_e$$inline_409$$)) {
      $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$ = new $goog$events$Event$$($JSCompiler_inline_result$$26_e$$23_e$$inline_409$$, this)
    }else {
      if($JSCompiler_inline_result$$26_e$$23_e$$inline_409$$ instanceof $goog$events$Event$$) {
        $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.target = $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.target || this
      }else {
        var $oldEvent$$inline_412_rv$$inline_413$$ = $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$, $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$ = new $goog$events$Event$$($hasCapture$$inline_415_type$$inline_410$$, this);
        $goog$object$extend$$($JSCompiler_inline_result$$26_e$$23_e$$inline_409$$, $oldEvent$$inline_412_rv$$inline_413$$)
      }
    }
    var $oldEvent$$inline_412_rv$$inline_413$$ = 1, $ancestors$$inline_414_current$$inline_419$$, $map$$inline_411$$ = $map$$inline_411$$[$hasCapture$$inline_415_type$$inline_410$$], $hasCapture$$inline_415_type$$inline_410$$ = $JSCompiler_alias_TRUE$$ in $map$$inline_411$$, $parent$$inline_417_targetsMap$$inline_416$$;
    if($hasCapture$$inline_415_type$$inline_410$$) {
      $ancestors$$inline_414_current$$inline_419$$ = [];
      for($parent$$inline_417_targetsMap$$inline_416$$ = this;$parent$$inline_417_targetsMap$$inline_416$$;$parent$$inline_417_targetsMap$$inline_416$$ = $parent$$inline_417_targetsMap$$inline_416$$.$parentEventTarget_$) {
        $ancestors$$inline_414_current$$inline_419$$.push($parent$$inline_417_targetsMap$$inline_416$$)
      }
      $parent$$inline_417_targetsMap$$inline_416$$ = $map$$inline_411$$[$JSCompiler_alias_TRUE$$];
      $parent$$inline_417_targetsMap$$inline_416$$.$remaining_$ = $parent$$inline_417_targetsMap$$inline_416$$.$count_$;
      for(var $i$$inline_418$$ = $ancestors$$inline_414_current$$inline_419$$.length - 1;!$JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.$propagationStopped_$ && 0 <= $i$$inline_418$$ && $parent$$inline_417_targetsMap$$inline_416$$.$remaining_$;$i$$inline_418$$--) {
        $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.currentTarget = $ancestors$$inline_414_current$$inline_419$$[$i$$inline_418$$], $oldEvent$$inline_412_rv$$inline_413$$ &= $goog$events$fireListeners_$$($parent$$inline_417_targetsMap$$inline_416$$, $ancestors$$inline_414_current$$inline_419$$[$i$$inline_418$$], $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.type, $JSCompiler_alias_TRUE$$, $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$) && $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.$returnValue_$ !=
        $JSCompiler_alias_FALSE$$
      }
    }
    if($JSCompiler_alias_FALSE$$ in $map$$inline_411$$) {
      if($parent$$inline_417_targetsMap$$inline_416$$ = $map$$inline_411$$[$JSCompiler_alias_FALSE$$], $parent$$inline_417_targetsMap$$inline_416$$.$remaining_$ = $parent$$inline_417_targetsMap$$inline_416$$.$count_$, $hasCapture$$inline_415_type$$inline_410$$) {
        for($i$$inline_418$$ = 0;!$JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.$propagationStopped_$ && $i$$inline_418$$ < $ancestors$$inline_414_current$$inline_419$$.length && $parent$$inline_417_targetsMap$$inline_416$$.$remaining_$;$i$$inline_418$$++) {
          $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.currentTarget = $ancestors$$inline_414_current$$inline_419$$[$i$$inline_418$$], $oldEvent$$inline_412_rv$$inline_413$$ &= $goog$events$fireListeners_$$($parent$$inline_417_targetsMap$$inline_416$$, $ancestors$$inline_414_current$$inline_419$$[$i$$inline_418$$], $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.type, $JSCompiler_alias_FALSE$$, $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$) && $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.$returnValue_$ !=
          $JSCompiler_alias_FALSE$$
        }
      }else {
        for($ancestors$$inline_414_current$$inline_419$$ = this;!$JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.$propagationStopped_$ && $ancestors$$inline_414_current$$inline_419$$ && $parent$$inline_417_targetsMap$$inline_416$$.$remaining_$;$ancestors$$inline_414_current$$inline_419$$ = $ancestors$$inline_414_current$$inline_419$$.$parentEventTarget_$) {
          $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.currentTarget = $ancestors$$inline_414_current$$inline_419$$, $oldEvent$$inline_412_rv$$inline_413$$ &= $goog$events$fireListeners_$$($parent$$inline_417_targetsMap$$inline_416$$, $ancestors$$inline_414_current$$inline_419$$, $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.type, $JSCompiler_alias_FALSE$$, $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$) && $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$.$returnValue_$ != $JSCompiler_alias_FALSE$$
        }
      }
    }
    $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$ = Boolean($oldEvent$$inline_412_rv$$inline_413$$)
  }else {
    $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$ = $JSCompiler_alias_TRUE$$
  }
  return $JSCompiler_inline_result$$26_e$$23_e$$inline_409$$
};
function $goog$math$Box$$($top$$3$$, $right$$6$$, $bottom$$2$$, $left$$6$$) {
  this.top = $top$$3$$;
  this.right = $right$$6$$;
  this.bottom = $bottom$$2$$;
  this.left = $left$$6$$
}
$goog$math$Box$$.prototype.contains = function $$goog$math$Box$$$$contains$($other$$4$$) {
  return!this || !$other$$4$$ ? $JSCompiler_alias_FALSE$$ : $other$$4$$ instanceof $goog$math$Box$$ ? $other$$4$$.left >= this.left && $other$$4$$.right <= this.right && $other$$4$$.top >= this.top && $other$$4$$.bottom <= this.bottom : $other$$4$$.x >= this.left && $other$$4$$.x <= this.right && $other$$4$$.y >= this.top && $other$$4$$.y <= this.bottom
};
function $goog$math$Rect$$($x$$69$$, $y$$38$$, $w$$5$$, $h$$4$$) {
  this.left = $x$$69$$;
  this.top = $y$$38$$;
  this.width = $w$$5$$;
  this.height = $h$$4$$
}
$goog$math$Rect$$.prototype.contains = function $$goog$math$Rect$$$$contains$($another$$) {
  return $another$$ instanceof $goog$math$Rect$$ ? this.left <= $another$$.left && this.left + this.width >= $another$$.left + $another$$.width && this.top <= $another$$.top && this.top + this.height >= $another$$.top + $another$$.height : $another$$.x >= this.left && $another$$.x <= this.left + this.width && $another$$.y >= this.top && $another$$.y <= this.top + this.height
};
function $goog$style$setStyle$$($element$$29$$, $style$$, $opt_value$$5$$) {
  $goog$isString$$($style$$) ? $goog$style$setStyle_$$($element$$29$$, $opt_value$$5$$, $style$$) : $goog$object$forEach$$($style$$, $goog$partial$$($goog$style$setStyle_$$, $element$$29$$))
}
function $goog$style$setStyle_$$($element$$30$$, $value$$65$$, $style$$1$$) {
  $element$$30$$.style[$goog$string$toCamelCase$$($style$$1$$)] = $value$$65$$
}
function $goog$style$getComputedStyle$$($element$$32$$, $property$$4$$) {
  var $doc$$23_styles$$ = $goog$dom$getOwnerDocument$$($element$$32$$);
  return $doc$$23_styles$$.defaultView && $doc$$23_styles$$.defaultView.getComputedStyle && ($doc$$23_styles$$ = $doc$$23_styles$$.defaultView.getComputedStyle($element$$32$$, $JSCompiler_alias_NULL$$)) ? $doc$$23_styles$$[$property$$4$$] || $doc$$23_styles$$.getPropertyValue($property$$4$$) || "" : ""
}
function $goog$style$getCascadedStyle$$($element$$33$$, $style$$2$$) {
  return $element$$33$$.currentStyle ? $element$$33$$.currentStyle[$style$$2$$] : $JSCompiler_alias_NULL$$
}
function $goog$style$getStyle_$$($element$$34$$, $style$$3$$) {
  return $goog$style$getComputedStyle$$($element$$34$$, $style$$3$$) || $goog$style$getCascadedStyle$$($element$$34$$, $style$$3$$) || $element$$34$$.style && $element$$34$$.style[$style$$3$$]
}
function $goog$style$setPosition$$($el$$4$$, $arg1_y$$39$$, $opt_arg2$$) {
  var $x$$70$$, $buggyGeckoSubPixelPos$$ = $goog$userAgent$GECKO$$ && ($goog$userAgent$detectedMac_$$ || $goog$userAgent$X11$$) && $goog$userAgent$isVersion$$("1.9");
  $arg1_y$$39$$ instanceof $goog$math$Coordinate$$ ? ($x$$70$$ = $arg1_y$$39$$.x, $arg1_y$$39$$ = $arg1_y$$39$$.y) : ($x$$70$$ = $arg1_y$$39$$, $arg1_y$$39$$ = $opt_arg2$$);
  $el$$4$$.style.left = $goog$style$getPixelStyleValue_$$($x$$70$$, $buggyGeckoSubPixelPos$$);
  $el$$4$$.style.top = $goog$style$getPixelStyleValue_$$($arg1_y$$39$$, $buggyGeckoSubPixelPos$$)
}
function $goog$style$getBoundingClientRect_$$($doc$$26_el$$5$$) {
  var $rect$$4$$ = $doc$$26_el$$5$$.getBoundingClientRect();
  $goog$userAgent$IE$$ && ($doc$$26_el$$5$$ = $doc$$26_el$$5$$.ownerDocument, $rect$$4$$.left -= $doc$$26_el$$5$$.documentElement.clientLeft + $doc$$26_el$$5$$.body.clientLeft, $rect$$4$$.top -= $doc$$26_el$$5$$.documentElement.clientTop + $doc$$26_el$$5$$.body.clientTop);
  return $rect$$4$$
}
function $goog$style$getOffsetParent$$($element$$43_parent$$19$$) {
  if($goog$userAgent$IE$$ && !$goog$userAgent$isDocumentMode$$(8)) {
    return $element$$43_parent$$19$$.offsetParent
  }
  for(var $doc$$27$$ = $goog$dom$getOwnerDocument$$($element$$43_parent$$19$$), $positionStyle$$ = $goog$style$getStyle_$$($element$$43_parent$$19$$, "position"), $skipStatic$$ = "fixed" == $positionStyle$$ || "absolute" == $positionStyle$$, $element$$43_parent$$19$$ = $element$$43_parent$$19$$.parentNode;$element$$43_parent$$19$$ && $element$$43_parent$$19$$ != $doc$$27$$;$element$$43_parent$$19$$ = $element$$43_parent$$19$$.parentNode) {
    if($positionStyle$$ = $goog$style$getStyle_$$($element$$43_parent$$19$$, "position"), $skipStatic$$ = $skipStatic$$ && "static" == $positionStyle$$ && $element$$43_parent$$19$$ != $doc$$27$$.documentElement && $element$$43_parent$$19$$ != $doc$$27$$.body, !$skipStatic$$ && ($element$$43_parent$$19$$.scrollWidth > $element$$43_parent$$19$$.clientWidth || $element$$43_parent$$19$$.scrollHeight > $element$$43_parent$$19$$.clientHeight || "fixed" == $positionStyle$$ || "absolute" == $positionStyle$$ ||
    "relative" == $positionStyle$$)) {
      return $element$$43_parent$$19$$
    }
  }
  return $JSCompiler_alias_NULL$$
}
function $goog$style$getPageOffset$$($el$$8_scrollCoord_vpBox$$) {
  var $box$$7_doc$$inline_423$$, $doc$$28$$ = $goog$dom$getOwnerDocument$$($el$$8_scrollCoord_vpBox$$), $positionStyle$$1$$ = $goog$style$getStyle_$$($el$$8_scrollCoord_vpBox$$, "position"), $BUGGY_GECKO_BOX_OBJECT_parent$$20$$ = $goog$userAgent$GECKO$$ && $doc$$28$$.getBoxObjectFor && !$el$$8_scrollCoord_vpBox$$.getBoundingClientRect && "absolute" == $positionStyle$$1$$ && ($box$$7_doc$$inline_423$$ = $doc$$28$$.getBoxObjectFor($el$$8_scrollCoord_vpBox$$)) && (0 > $box$$7_doc$$inline_423$$.screenX ||
  0 > $box$$7_doc$$inline_423$$.screenY), $pos$$2$$ = new $goog$math$Coordinate$$(0, 0), $JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$;
  $box$$7_doc$$inline_423$$ = $doc$$28$$ ? $goog$dom$getOwnerDocument$$($doc$$28$$) : document;
  if($JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$ = $goog$userAgent$IE$$) {
    if($JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$ = !$goog$userAgent$isDocumentMode$$(9)) {
      $goog$dom$getDomHelper$$($box$$7_doc$$inline_423$$), $JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$ = $JSCompiler_alias_FALSE$$
    }
  }
  $JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$ = $JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$ ? $box$$7_doc$$inline_423$$.body : $box$$7_doc$$inline_423$$.documentElement;
  if($el$$8_scrollCoord_vpBox$$ == $JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$) {
    return $pos$$2$$
  }
  if($el$$8_scrollCoord_vpBox$$.getBoundingClientRect) {
    $box$$7_doc$$inline_423$$ = $goog$style$getBoundingClientRect_$$($el$$8_scrollCoord_vpBox$$), $el$$8_scrollCoord_vpBox$$ = $JSCompiler_StaticMethods_getDocumentScroll$$($goog$dom$getDomHelper$$($doc$$28$$)), $pos$$2$$.x = $box$$7_doc$$inline_423$$.left + $el$$8_scrollCoord_vpBox$$.x, $pos$$2$$.y = $box$$7_doc$$inline_423$$.top + $el$$8_scrollCoord_vpBox$$.y
  }else {
    if($doc$$28$$.getBoxObjectFor && !$BUGGY_GECKO_BOX_OBJECT_parent$$20$$) {
      $box$$7_doc$$inline_423$$ = $doc$$28$$.getBoxObjectFor($el$$8_scrollCoord_vpBox$$), $el$$8_scrollCoord_vpBox$$ = $doc$$28$$.getBoxObjectFor($JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$), $pos$$2$$.x = $box$$7_doc$$inline_423$$.screenX - $el$$8_scrollCoord_vpBox$$.screenX, $pos$$2$$.y = $box$$7_doc$$inline_423$$.screenY - $el$$8_scrollCoord_vpBox$$.screenY
    }else {
      $BUGGY_GECKO_BOX_OBJECT_parent$$20$$ = $el$$8_scrollCoord_vpBox$$;
      do {
        $pos$$2$$.x += $BUGGY_GECKO_BOX_OBJECT_parent$$20$$.offsetLeft;
        $pos$$2$$.y += $BUGGY_GECKO_BOX_OBJECT_parent$$20$$.offsetTop;
        $BUGGY_GECKO_BOX_OBJECT_parent$$20$$ != $el$$8_scrollCoord_vpBox$$ && ($pos$$2$$.x += $BUGGY_GECKO_BOX_OBJECT_parent$$20$$.clientLeft || 0, $pos$$2$$.y += $BUGGY_GECKO_BOX_OBJECT_parent$$20$$.clientTop || 0);
        if($goog$userAgent$WEBKIT$$ && "fixed" == $goog$style$getStyle_$$($BUGGY_GECKO_BOX_OBJECT_parent$$20$$, "position")) {
          $pos$$2$$.x += $doc$$28$$.body.scrollLeft;
          $pos$$2$$.y += $doc$$28$$.body.scrollTop;
          break
        }
        $BUGGY_GECKO_BOX_OBJECT_parent$$20$$ = $BUGGY_GECKO_BOX_OBJECT_parent$$20$$.offsetParent
      }while($BUGGY_GECKO_BOX_OBJECT_parent$$20$$ && $BUGGY_GECKO_BOX_OBJECT_parent$$20$$ != $el$$8_scrollCoord_vpBox$$);
      if($goog$userAgent$OPERA$$ || $goog$userAgent$WEBKIT$$ && "absolute" == $positionStyle$$1$$) {
        $pos$$2$$.y -= $doc$$28$$.body.offsetTop
      }
      for($BUGGY_GECKO_BOX_OBJECT_parent$$20$$ = $el$$8_scrollCoord_vpBox$$;($BUGGY_GECKO_BOX_OBJECT_parent$$20$$ = $goog$style$getOffsetParent$$($BUGGY_GECKO_BOX_OBJECT_parent$$20$$)) && $BUGGY_GECKO_BOX_OBJECT_parent$$20$$ != $doc$$28$$.body && $BUGGY_GECKO_BOX_OBJECT_parent$$20$$ != $JSCompiler_temp$$790_JSCompiler_temp$$791_viewportElement$$;) {
        if($pos$$2$$.x -= $BUGGY_GECKO_BOX_OBJECT_parent$$20$$.scrollLeft, !$goog$userAgent$OPERA$$ || "TR" != $BUGGY_GECKO_BOX_OBJECT_parent$$20$$.tagName) {
          $pos$$2$$.y -= $BUGGY_GECKO_BOX_OBJECT_parent$$20$$.scrollTop
        }
      }
    }
  }
  return $pos$$2$$
}
function $goog$style$getRelativePosition$$($a$$28$$, $b$$23$$) {
  var $ap$$ = $goog$style$getClientPosition$$($a$$28$$), $bp$$ = $goog$style$getClientPosition$$($b$$23$$);
  return new $goog$math$Coordinate$$($ap$$.x - $bp$$.x, $ap$$.y - $bp$$.y)
}
function $goog$style$getClientPosition$$($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$) {
  var $JSCompiler_temp_const$$36_pos$$4$$ = new $goog$math$Coordinate$$;
  if(1 == $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.nodeType) {
    if($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.getBoundingClientRect) {
      var $box$$8_scrollCoord$$1$$ = $goog$style$getBoundingClientRect_$$($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$);
      $JSCompiler_temp_const$$36_pos$$4$$.x = $box$$8_scrollCoord$$1$$.left;
      $JSCompiler_temp_const$$36_pos$$4$$.y = $box$$8_scrollCoord$$1$$.top
    }else {
      var $box$$8_scrollCoord$$1$$ = $JSCompiler_StaticMethods_getDocumentScroll$$($goog$dom$getDomHelper$$($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$)), $pageCoord$$ = $goog$style$getPageOffset$$($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$);
      $JSCompiler_temp_const$$36_pos$$4$$.x = $pageCoord$$.x - $box$$8_scrollCoord$$1$$.x;
      $JSCompiler_temp_const$$36_pos$$4$$.y = $pageCoord$$.y - $box$$8_scrollCoord$$1$$.y
    }
    if($goog$userAgent$GECKO$$ && !$goog$userAgent$isVersion$$(12)) {
      var $isAbstractedEvent_property$$inline_426$$;
      $goog$userAgent$IE$$ ? $isAbstractedEvent_property$$inline_426$$ = "-ms-transform" : $goog$userAgent$WEBKIT$$ ? $isAbstractedEvent_property$$inline_426$$ = "-webkit-transform" : $goog$userAgent$OPERA$$ ? $isAbstractedEvent_property$$inline_426$$ = "-o-transform" : $goog$userAgent$GECKO$$ && ($isAbstractedEvent_property$$inline_426$$ = "-moz-transform");
      var $targetEvent_transform$$inline_427$$;
      $isAbstractedEvent_property$$inline_426$$ && ($targetEvent_transform$$inline_427$$ = $goog$style$getStyle_$$($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$, $isAbstractedEvent_property$$inline_426$$));
      $targetEvent_transform$$inline_427$$ || ($targetEvent_transform$$inline_427$$ = $goog$style$getStyle_$$($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$, "transform"));
      $targetEvent_transform$$inline_427$$ ? ($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$ = $targetEvent_transform$$inline_427$$.match($goog$style$MATRIX_TRANSLATION_REGEX_$$), $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$ = !$JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$ ? new $goog$math$Coordinate$$(0, 0) : new $goog$math$Coordinate$$(parseFloat($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$[1]), parseFloat($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$[2]))) :
      $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$ = new $goog$math$Coordinate$$(0, 0);
      $JSCompiler_temp_const$$36_pos$$4$$ = new $goog$math$Coordinate$$($JSCompiler_temp_const$$36_pos$$4$$.x + $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.x, $JSCompiler_temp_const$$36_pos$$4$$.y + $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.y)
    }
  }else {
    $isAbstractedEvent_property$$inline_426$$ = $goog$isFunction$$($JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.$getBrowserEvent$), $targetEvent_transform$$inline_427$$ = $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$, $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.targetTouches ? $targetEvent_transform$$inline_427$$ = $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.targetTouches[0] : $isAbstractedEvent_property$$inline_426$$ && $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.$event_$.targetTouches &&
    ($targetEvent_transform$$inline_427$$ = $JSCompiler_inline_result$$37_el$$12_matches$$inline_428$$.$event_$.targetTouches[0]), $JSCompiler_temp_const$$36_pos$$4$$.x = $targetEvent_transform$$inline_427$$.clientX, $JSCompiler_temp_const$$36_pos$$4$$.y = $targetEvent_transform$$inline_427$$.clientY
  }
  return $JSCompiler_temp_const$$36_pos$$4$$
}
function $goog$style$setSize$$($element$$47$$, $w$$6$$, $h$$5_opt_h$$) {
  $w$$6$$ instanceof $goog$math$Size$$ ? ($h$$5_opt_h$$ = $w$$6$$.height, $w$$6$$ = $w$$6$$.width) : $h$$5_opt_h$$ == $JSCompiler_alias_VOID$$ && $JSCompiler_alias_THROW$$(Error("missing height argument"));
  $element$$47$$.style.width = $goog$style$getPixelStyleValue_$$($w$$6$$, $JSCompiler_alias_TRUE$$);
  $element$$47$$.style.height = $goog$style$getPixelStyleValue_$$($h$$5_opt_h$$, $JSCompiler_alias_TRUE$$)
}
function $goog$style$getPixelStyleValue_$$($value$$66$$, $round$$) {
  "number" == typeof $value$$66$$ && ($value$$66$$ = ($round$$ ? Math.round($value$$66$$) : $value$$66$$) + "px");
  return $value$$66$$
}
function $goog$style$getSize$$($element$$50_size$$10$$) {
  if("none" != $goog$style$getStyle_$$($element$$50_size$$10$$, "display")) {
    return $goog$style$getSizeWithDisplay_$$($element$$50_size$$10$$)
  }
  var $style$$4$$ = $element$$50_size$$10$$.style, $originalDisplay$$ = $style$$4$$.display, $originalVisibility$$ = $style$$4$$.visibility, $originalPosition$$ = $style$$4$$.position;
  $style$$4$$.visibility = "hidden";
  $style$$4$$.position = "absolute";
  $style$$4$$.display = "inline";
  $element$$50_size$$10$$ = $goog$style$getSizeWithDisplay_$$($element$$50_size$$10$$);
  $style$$4$$.display = $originalDisplay$$;
  $style$$4$$.position = $originalPosition$$;
  $style$$4$$.visibility = $originalVisibility$$;
  return $element$$50_size$$10$$
}
function $goog$style$getSizeWithDisplay_$$($clientRect_element$$51$$) {
  var $offsetWidth$$ = $clientRect_element$$51$$.offsetWidth, $offsetHeight$$ = $clientRect_element$$51$$.offsetHeight, $webkitOffsetsZero$$ = $goog$userAgent$WEBKIT$$ && !$offsetWidth$$ && !$offsetHeight$$;
  return(!$goog$isDef$$($offsetWidth$$) || $webkitOffsetsZero$$) && $clientRect_element$$51$$.getBoundingClientRect ? ($clientRect_element$$51$$ = $goog$style$getBoundingClientRect_$$($clientRect_element$$51$$), new $goog$math$Size$$($clientRect_element$$51$$.right - $clientRect_element$$51$$.left, $clientRect_element$$51$$.bottom - $clientRect_element$$51$$.top)) : new $goog$math$Size$$($offsetWidth$$, $offsetHeight$$)
}
function $goog$style$getBounds$$($element$$52_s$$18$$) {
  var $o$$1$$ = $goog$style$getPageOffset$$($element$$52_s$$18$$), $element$$52_s$$18$$ = $goog$style$getSize$$($element$$52_s$$18$$);
  return new $goog$math$Rect$$($o$$1$$.x, $o$$1$$.y, $element$$52_s$$18$$.width, $element$$52_s$$18$$.height)
}
function $goog$style$setOpacity$$($el$$15$$, $alpha$$3$$) {
  var $style$$6$$ = $el$$15$$.style;
  "opacity" in $style$$6$$ ? $style$$6$$.opacity = $alpha$$3$$ : "MozOpacity" in $style$$6$$ ? $style$$6$$.MozOpacity = $alpha$$3$$ : "filter" in $style$$6$$ && ($style$$6$$.filter = "" === $alpha$$3$$ ? "" : "alpha(opacity=" + 100 * $alpha$$3$$ + ")")
}
function $goog$style$showElement$$($el$$18$$, $display$$) {
  $el$$18$$.style.display = $display$$ ? "" : "none"
}
function $goog$style$isRightToLeft$$($el$$22$$) {
  return"rtl" == $goog$style$getStyle_$$($el$$22$$, "direction")
}
var $goog$style$unselectableStyle_$$ = $goog$userAgent$GECKO$$ ? "MozUserSelect" : $goog$userAgent$WEBKIT$$ ? "WebkitUserSelect" : $JSCompiler_alias_NULL$$;
function $goog$style$getIePixelValue_$$($element$$59$$, $value$$68$$) {
  if(/^\d+px?$/.test($value$$68$$)) {
    return parseInt($value$$68$$, 10)
  }
  var $oldStyleValue$$ = $element$$59$$.style.left, $oldRuntimeValue$$ = $element$$59$$.runtimeStyle.left;
  $element$$59$$.runtimeStyle.left = $element$$59$$.currentStyle.left;
  $element$$59$$.style.left = $value$$68$$;
  var $pixelValue$$ = $element$$59$$.style.pixelLeft;
  $element$$59$$.style.left = $oldStyleValue$$;
  $element$$59$$.runtimeStyle.left = $oldRuntimeValue$$;
  return $pixelValue$$
}
function $goog$style$getBox_$$($element$$61$$, $stylePrefix$$) {
  if($goog$userAgent$IE$$) {
    var $left$$8$$ = $goog$style$getIePixelValue_$$($element$$61$$, $goog$style$getCascadedStyle$$($element$$61$$, $stylePrefix$$ + "Left")), $right$$9$$ = $goog$style$getIePixelValue_$$($element$$61$$, $goog$style$getCascadedStyle$$($element$$61$$, $stylePrefix$$ + "Right")), $top$$6$$ = $goog$style$getIePixelValue_$$($element$$61$$, $goog$style$getCascadedStyle$$($element$$61$$, $stylePrefix$$ + "Top")), $bottom$$5$$ = $goog$style$getIePixelValue_$$($element$$61$$, $goog$style$getCascadedStyle$$($element$$61$$,
    $stylePrefix$$ + "Bottom"));
    return new $goog$math$Box$$($top$$6$$, $right$$9$$, $bottom$$5$$, $left$$8$$)
  }
  $left$$8$$ = $goog$style$getComputedStyle$$($element$$61$$, $stylePrefix$$ + "Left");
  $right$$9$$ = $goog$style$getComputedStyle$$($element$$61$$, $stylePrefix$$ + "Right");
  $top$$6$$ = $goog$style$getComputedStyle$$($element$$61$$, $stylePrefix$$ + "Top");
  $bottom$$5$$ = $goog$style$getComputedStyle$$($element$$61$$, $stylePrefix$$ + "Bottom");
  return new $goog$math$Box$$(parseFloat($top$$6$$), parseFloat($right$$9$$), parseFloat($bottom$$5$$), parseFloat($left$$8$$))
}
var $goog$style$ieBorderWidthKeywords_$$ = {thin:2, medium:4, thick:6};
function $goog$style$getIePixelBorder_$$($element$$64$$, $prop$$5$$) {
  if("none" == $goog$style$getCascadedStyle$$($element$$64$$, $prop$$5$$ + "Style")) {
    return 0
  }
  var $width$$15$$ = $goog$style$getCascadedStyle$$($element$$64$$, $prop$$5$$ + "Width");
  return $width$$15$$ in $goog$style$ieBorderWidthKeywords_$$ ? $goog$style$ieBorderWidthKeywords_$$[$width$$15$$] : $goog$style$getIePixelValue_$$($element$$64$$, $width$$15$$)
}
function $goog$style$getBorderBox$$($bottom$$6_element$$65$$) {
  if($goog$userAgent$IE$$) {
    var $left$$9$$ = $goog$style$getIePixelBorder_$$($bottom$$6_element$$65$$, "borderLeft"), $right$$10$$ = $goog$style$getIePixelBorder_$$($bottom$$6_element$$65$$, "borderRight"), $top$$7$$ = $goog$style$getIePixelBorder_$$($bottom$$6_element$$65$$, "borderTop"), $bottom$$6_element$$65$$ = $goog$style$getIePixelBorder_$$($bottom$$6_element$$65$$, "borderBottom");
    return new $goog$math$Box$$($top$$7$$, $right$$10$$, $bottom$$6_element$$65$$, $left$$9$$)
  }
  $left$$9$$ = $goog$style$getComputedStyle$$($bottom$$6_element$$65$$, "borderLeftWidth");
  $right$$10$$ = $goog$style$getComputedStyle$$($bottom$$6_element$$65$$, "borderRightWidth");
  $top$$7$$ = $goog$style$getComputedStyle$$($bottom$$6_element$$65$$, "borderTopWidth");
  $bottom$$6_element$$65$$ = $goog$style$getComputedStyle$$($bottom$$6_element$$65$$, "borderBottomWidth");
  return new $goog$math$Box$$(parseFloat($top$$7$$), parseFloat($right$$10$$), parseFloat($bottom$$6_element$$65$$), parseFloat($left$$9$$))
}
var $goog$style$MATRIX_TRANSLATION_REGEX_$$ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
function $goog$fx$Dragger$$($target$$43$$, $opt_handle$$, $opt_limits$$) {
  $goog$Disposable$$.call(this);
  this.target = $target$$43$$;
  this.handle = $opt_handle$$ || $target$$43$$;
  this.$limits$ = $opt_limits$$ || new $goog$math$Rect$$(NaN, NaN, NaN, NaN);
  this.$document_$ = $goog$dom$getOwnerDocument$$($target$$43$$);
  this.$eventHandler_$ = new $goog$events$EventHandler$$(this);
  $goog$events$listen$$(this.handle, ["touchstart", "mousedown"], this.$startDrag$, $JSCompiler_alias_FALSE$$, this)
}
$goog$inherits$$($goog$fx$Dragger$$, $goog$events$EventTarget$$);
var $goog$fx$Dragger$HAS_SET_CAPTURE_$$ = $goog$userAgent$IE$$ || $goog$userAgent$GECKO$$ && $goog$userAgent$isVersion$$("1.9.3");
$JSCompiler_prototypeAlias$$ = $goog$fx$Dragger$$.prototype;
$JSCompiler_prototypeAlias$$.clientX = 0;
$JSCompiler_prototypeAlias$$.clientY = 0;
$JSCompiler_prototypeAlias$$.screenX = 0;
$JSCompiler_prototypeAlias$$.screenY = 0;
$JSCompiler_prototypeAlias$$.$startX$ = 0;
$JSCompiler_prototypeAlias$$.$startY$ = 0;
$JSCompiler_prototypeAlias$$.$deltaX$ = 0;
$JSCompiler_prototypeAlias$$.$deltaY$ = 0;
$JSCompiler_prototypeAlias$$.$enabled_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.$dragging_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$hysteresisDistanceSquared_$ = 0;
$JSCompiler_prototypeAlias$$.$mouseDownTime_$ = 0;
$JSCompiler_prototypeAlias$$.$ieDragStartCancellingOn_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$useRightPositioningForRtl_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$getHandler$ = $JSCompiler_get$$("$eventHandler_$");
function $JSCompiler_StaticMethods_isRightToLeft_$$($JSCompiler_StaticMethods_isRightToLeft_$self$$) {
  $goog$isDef$$($JSCompiler_StaticMethods_isRightToLeft_$self$$.$rightToLeft_$) || ($JSCompiler_StaticMethods_isRightToLeft_$self$$.$rightToLeft_$ = $goog$style$isRightToLeft$$($JSCompiler_StaticMethods_isRightToLeft_$self$$.target));
  return $JSCompiler_StaticMethods_isRightToLeft_$self$$.$rightToLeft_$
}
$JSCompiler_prototypeAlias$$.$startDrag$ = function $$JSCompiler_prototypeAlias$$$$startDrag$$($JSCompiler_temp$$49_e$$25_element$$inline_445$$) {
  var $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$ = "mousedown" == $JSCompiler_temp$$49_e$$25_element$$inline_445$$.type;
  if(this.$enabled_$ && !this.$dragging_$ && (!$doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$ || $JSCompiler_StaticMethods_isMouseActionButton$$($JSCompiler_temp$$49_e$$25_element$$inline_445$$))) {
    $JSCompiler_StaticMethods_maybeReinitTouchEvent_$$($JSCompiler_temp$$49_e$$25_element$$inline_445$$);
    if(0 == this.$hysteresisDistanceSquared_$) {
      if(this.dispatchEvent(new $goog$fx$DragEvent$$("start", this, $JSCompiler_temp$$49_e$$25_element$$inline_445$$.clientX, $JSCompiler_temp$$49_e$$25_element$$inline_445$$.clientY, $JSCompiler_temp$$49_e$$25_element$$inline_445$$))) {
        this.$dragging_$ = $JSCompiler_alias_TRUE$$, $JSCompiler_temp$$49_e$$25_element$$inline_445$$.preventDefault()
      }else {
        return
      }
    }else {
      $JSCompiler_temp$$49_e$$25_element$$inline_445$$.preventDefault()
    }
    var $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$ = this.$document_$, $bestParent$$inline_447_docEl$$inline_442$$ = $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$.documentElement, $borderWidths$$inline_448_useCapture$$inline_443$$ = !$goog$fx$Dragger$HAS_SET_CAPTURE_$$;
    $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$, ["touchmove", "mousemove"], this.$handleMove_$, $borderWidths$$inline_448_useCapture$$inline_443$$);
    $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$, ["touchend", "mouseup"], this.$endDrag$, $borderWidths$$inline_448_useCapture$$inline_443$$);
    $goog$fx$Dragger$HAS_SET_CAPTURE_$$ ? ($bestParent$$inline_447_docEl$$inline_442$$.setCapture($JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $bestParent$$inline_447_docEl$$inline_442$$, "losecapture", this.$endDrag$)) : $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$ ? $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$.parentWindow || $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$.defaultView :
    window, "blur", this.$endDrag$);
    $goog$userAgent$IE$$ && this.$ieDragStartCancellingOn_$ && $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$, "dragstart", $goog$events$Event$preventDefault$$);
    this.$scrollTarget_$ && $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, this.$scrollTarget_$, "scroll", this.$onScroll_$, $borderWidths$$inline_448_useCapture$$inline_443$$);
    this.clientX = this.$startX$ = $JSCompiler_temp$$49_e$$25_element$$inline_445$$.clientX;
    this.clientY = this.$startY$ = $JSCompiler_temp$$49_e$$25_element$$inline_445$$.clientY;
    this.screenX = $JSCompiler_temp$$49_e$$25_element$$inline_445$$.screenX;
    this.screenY = $JSCompiler_temp$$49_e$$25_element$$inline_445$$.screenY;
    this.$useRightPositioningForRtl_$ ? ($JSCompiler_temp$$49_e$$25_element$$inline_445$$ = this.target, $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$ = $JSCompiler_temp$$49_e$$25_element$$inline_445$$.offsetLeft, $bestParent$$inline_447_docEl$$inline_442$$ = $JSCompiler_temp$$49_e$$25_element$$inline_445$$.offsetParent, !$bestParent$$inline_447_docEl$$inline_442$$ && "fixed" == $goog$style$getStyle_$$($JSCompiler_temp$$49_e$$25_element$$inline_445$$, "position") && ($bestParent$$inline_447_docEl$$inline_442$$ =
    $goog$dom$getOwnerDocument$$($JSCompiler_temp$$49_e$$25_element$$inline_445$$).documentElement), $bestParent$$inline_447_docEl$$inline_442$$ ? ($goog$userAgent$GECKO$$ ? ($borderWidths$$inline_448_useCapture$$inline_443$$ = $goog$style$getBorderBox$$($bestParent$$inline_447_docEl$$inline_442$$), $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$ += $borderWidths$$inline_448_useCapture$$inline_443$$.left) : $goog$userAgent$isDocumentMode$$(8) && ($borderWidths$$inline_448_useCapture$$inline_443$$ =
    $goog$style$getBorderBox$$($bestParent$$inline_447_docEl$$inline_442$$), $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$ -= $borderWidths$$inline_448_useCapture$$inline_443$$.left), $JSCompiler_temp$$49_e$$25_element$$inline_445$$ = $goog$style$isRightToLeft$$($bestParent$$inline_447_docEl$$inline_442$$) ? $bestParent$$inline_447_docEl$$inline_442$$.clientWidth - ($doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$ + $JSCompiler_temp$$49_e$$25_element$$inline_445$$.offsetWidth) :
    $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$) : $JSCompiler_temp$$49_e$$25_element$$inline_445$$ = $doc$$inline_441_isMouseDown_offsetLeftForReal$$inline_446$$) : $JSCompiler_temp$$49_e$$25_element$$inline_445$$ = this.target.offsetLeft;
    this.$deltaX$ = $JSCompiler_temp$$49_e$$25_element$$inline_445$$;
    this.$deltaY$ = this.target.offsetTop;
    this.$pageScroll$ = $JSCompiler_StaticMethods_getDocumentScroll$$($goog$dom$getDomHelper$$(this.$document_$));
    this.$mouseDownTime_$ = $goog$now$$()
  }else {
    this.dispatchEvent("earlycancel")
  }
};
$JSCompiler_prototypeAlias$$.$endDrag$ = function $$JSCompiler_prototypeAlias$$$$endDrag$$($e$$27$$, $opt_dragCanceled$$) {
  this.$eventHandler_$.$removeAll$();
  $goog$fx$Dragger$HAS_SET_CAPTURE_$$ && this.$document_$.releaseCapture();
  if(this.$dragging_$) {
    $JSCompiler_StaticMethods_maybeReinitTouchEvent_$$($e$$27$$);
    this.$dragging_$ = $JSCompiler_alias_FALSE$$;
    var $x$$72$$ = $JSCompiler_StaticMethods_limitX$$(this, this.$deltaX$), $y$$40$$ = $JSCompiler_StaticMethods_limitY$$(this, this.$deltaY$);
    this.dispatchEvent(new $goog$fx$DragEvent$$("end", this, $e$$27$$.clientX, $e$$27$$.clientY, $e$$27$$, $x$$72$$, $y$$40$$, $opt_dragCanceled$$ || "touchcancel" == $e$$27$$.type))
  }else {
    this.dispatchEvent("earlycancel")
  }
  ("touchend" == $e$$27$$.type || "touchcancel" == $e$$27$$.type) && $e$$27$$.preventDefault()
};
function $JSCompiler_StaticMethods_maybeReinitTouchEvent_$$($e$$29$$) {
  var $type$$77$$ = $e$$29$$.type;
  "touchstart" == $type$$77$$ || "touchmove" == $type$$77$$ ? $e$$29$$.init($e$$29$$.$event_$.targetTouches[0], $e$$29$$.currentTarget) : ("touchend" == $type$$77$$ || "touchcancel" == $type$$77$$) && $e$$29$$.init($e$$29$$.$event_$.changedTouches[0], $e$$29$$.currentTarget)
}
$JSCompiler_prototypeAlias$$.$handleMove_$ = function $$JSCompiler_prototypeAlias$$$$handleMove_$$($e$$30$$) {
  if(this.$enabled_$) {
    $JSCompiler_StaticMethods_maybeReinitTouchEvent_$$($e$$30$$);
    var $dx$$7_x$$73$$ = (this.$useRightPositioningForRtl_$ && $JSCompiler_StaticMethods_isRightToLeft_$$(this) ? -1 : 1) * ($e$$30$$.clientX - this.clientX), $dy$$7_pos$$5_y$$41$$ = $e$$30$$.clientY - this.clientY;
    this.clientX = $e$$30$$.clientX;
    this.clientY = $e$$30$$.clientY;
    this.screenX = $e$$30$$.screenX;
    this.screenY = $e$$30$$.screenY;
    if(!this.$dragging_$) {
      var $diffX$$ = this.$startX$ - this.clientX, $diffY$$ = this.$startY$ - this.clientY;
      if($diffX$$ * $diffX$$ + $diffY$$ * $diffY$$ > this.$hysteresisDistanceSquared_$) {
        if(this.dispatchEvent(new $goog$fx$DragEvent$$("start", this, $e$$30$$.clientX, $e$$30$$.clientY, $e$$30$$))) {
          this.$dragging_$ = $JSCompiler_alias_TRUE$$
        }else {
          this.$disposed_$ || this.$endDrag$($e$$30$$);
          return
        }
      }
    }
    $dy$$7_pos$$5_y$$41$$ = $JSCompiler_StaticMethods_calculatePosition_$$(this, $dx$$7_x$$73$$, $dy$$7_pos$$5_y$$41$$);
    $dx$$7_x$$73$$ = $dy$$7_pos$$5_y$$41$$.x;
    $dy$$7_pos$$5_y$$41$$ = $dy$$7_pos$$5_y$$41$$.y;
    this.$dragging_$ && this.dispatchEvent(new $goog$fx$DragEvent$$("beforedrag", this, $e$$30$$.clientX, $e$$30$$.clientY, $e$$30$$, $dx$$7_x$$73$$, $dy$$7_pos$$5_y$$41$$)) && ($JSCompiler_StaticMethods_doDrag$$(this, $e$$30$$, $dx$$7_x$$73$$, $dy$$7_pos$$5_y$$41$$), $e$$30$$.preventDefault())
  }
};
function $JSCompiler_StaticMethods_calculatePosition_$$($JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$, $dx$$8_x$$74$$, $dy$$8$$) {
  var $pageScroll$$ = $JSCompiler_StaticMethods_getDocumentScroll$$($goog$dom$getDomHelper$$($JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$.$document_$)), $dx$$8_x$$74$$ = $dx$$8_x$$74$$ + ($pageScroll$$.x - $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$.$pageScroll$.x), $dy$$8$$ = $dy$$8$$ + ($pageScroll$$.y - $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$.$pageScroll$.y);
  $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$.$pageScroll$ = $pageScroll$$;
  $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$.$deltaX$ += $dx$$8_x$$74$$;
  $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$.$deltaY$ += $dy$$8$$;
  $dx$$8_x$$74$$ = $JSCompiler_StaticMethods_limitX$$($JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$, $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$.$deltaX$);
  $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$ = $JSCompiler_StaticMethods_limitY$$($JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$, $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$.$deltaY$);
  return new $goog$math$Coordinate$$($dx$$8_x$$74$$, $JSCompiler_StaticMethods_calculatePosition_$self_y$$42$$)
}
$JSCompiler_prototypeAlias$$.$onScroll_$ = function $$JSCompiler_prototypeAlias$$$$onScroll_$$($e$$31$$) {
  var $pos$$6$$ = $JSCompiler_StaticMethods_calculatePosition_$$(this, 0, 0);
  $e$$31$$.clientX = this.clientX;
  $e$$31$$.clientY = this.clientY;
  $JSCompiler_StaticMethods_doDrag$$(this, $e$$31$$, $pos$$6$$.x, $pos$$6$$.y)
};
function $JSCompiler_StaticMethods_doDrag$$($JSCompiler_StaticMethods_doDrag$self$$, $e$$32$$, $x$$75$$, $y$$43$$) {
  $JSCompiler_StaticMethods_doDrag$self$$.$defaultAction$($x$$75$$, $y$$43$$);
  $JSCompiler_StaticMethods_doDrag$self$$.dispatchEvent(new $goog$fx$DragEvent$$("drag", $JSCompiler_StaticMethods_doDrag$self$$, $e$$32$$.clientX, $e$$32$$.clientY, $e$$32$$, $x$$75$$, $y$$43$$))
}
function $JSCompiler_StaticMethods_limitX$$($JSCompiler_StaticMethods_limitX$self$$, $x$$76$$) {
  var $rect$$6_width$$17$$ = $JSCompiler_StaticMethods_limitX$self$$.$limits$, $left$$11$$ = !isNaN($rect$$6_width$$17$$.left) ? $rect$$6_width$$17$$.left : $JSCompiler_alias_NULL$$, $rect$$6_width$$17$$ = !isNaN($rect$$6_width$$17$$.width) ? $rect$$6_width$$17$$.width : 0;
  return Math.min($left$$11$$ != $JSCompiler_alias_NULL$$ ? $left$$11$$ + $rect$$6_width$$17$$ : Infinity, Math.max($left$$11$$ != $JSCompiler_alias_NULL$$ ? $left$$11$$ : -Infinity, $x$$76$$))
}
function $JSCompiler_StaticMethods_limitY$$($JSCompiler_StaticMethods_limitY$self$$, $y$$44$$) {
  var $height$$16_rect$$7$$ = $JSCompiler_StaticMethods_limitY$self$$.$limits$, $top$$9$$ = !isNaN($height$$16_rect$$7$$.top) ? $height$$16_rect$$7$$.top : $JSCompiler_alias_NULL$$, $height$$16_rect$$7$$ = !isNaN($height$$16_rect$$7$$.height) ? $height$$16_rect$$7$$.height : 0;
  return Math.min($top$$9$$ != $JSCompiler_alias_NULL$$ ? $top$$9$$ + $height$$16_rect$$7$$ : Infinity, Math.max($top$$9$$ != $JSCompiler_alias_NULL$$ ? $top$$9$$ : -Infinity, $y$$44$$))
}
$JSCompiler_prototypeAlias$$.$defaultAction$ = function $$JSCompiler_prototypeAlias$$$$defaultAction$$($x$$77$$, $y$$45$$) {
  this.$useRightPositioningForRtl_$ && $JSCompiler_StaticMethods_isRightToLeft_$$(this) ? this.target.style.right = $x$$77$$ + "px" : this.target.style.left = $x$$77$$ + "px";
  this.target.style.top = $y$$45$$ + "px"
};
function $goog$fx$DragEvent$$($type$$78$$, $dragobj$$, $clientX$$2$$, $clientY$$2$$, $browserEvent$$, $opt_actX$$, $opt_actY$$, $opt_dragCanceled$$1$$) {
  $goog$events$Event$$.call(this, $type$$78$$);
  this.clientX = $clientX$$2$$;
  this.clientY = $clientY$$2$$;
  this.$browserEvent$ = $browserEvent$$;
  this.left = $goog$isDef$$($opt_actX$$) ? $opt_actX$$ : $dragobj$$.$deltaX$;
  this.top = $goog$isDef$$($opt_actY$$) ? $opt_actY$$ : $dragobj$$.$deltaY$;
  this.$dragger$ = $dragobj$$;
  this.$dragCanceled$ = !!$opt_dragCanceled$$1$$
}
$goog$inherits$$($goog$fx$DragEvent$$, $goog$events$Event$$);
function $annotorious$dom$getOffset$$($el$$29$$) {
  for(var $_x$$ = 0, $_y$$ = 0;$el$$29$$ && !isNaN($el$$29$$.offsetLeft) && !isNaN($el$$29$$.offsetTop);) {
    $_x$$ += $el$$29$$.offsetLeft - $el$$29$$.scrollLeft, $_y$$ += $el$$29$$.offsetTop - $el$$29$$.scrollTop, $el$$29$$ = $el$$29$$.offsetParent
  }
  return{top:$_y$$, left:$_x$$}
}
;function $annotorious$events$EventBroker$$() {
  this.$_handlers$ = []
}
function $annotorious$events$sanitizeCoordinates$$($event$$3$$, $parent$$21$$) {
  var $points$$ = $JSCompiler_alias_FALSE$$;
  return $points$$ = !$event$$3$$.offsetX || !$event$$3$$.offsetY && $event$$3$$.$event_$.changedTouches ? {x:$event$$3$$.$event_$.changedTouches[0].clientX - $annotorious$dom$getOffset$$($parent$$21$$).left, y:$event$$3$$.$event_$.changedTouches[0].clientY - $annotorious$dom$getOffset$$($parent$$21$$).top} : {x:$event$$3$$.offsetX, y:$event$$3$$.offsetY}
}
$annotorious$events$EventBroker$$.prototype.$addHandler$ = function $$annotorious$events$EventBroker$$$$$addHandler$$($type$$79$$, $handler$$5$$) {
  this.$_handlers$[$type$$79$$] || (this.$_handlers$[$type$$79$$] = []);
  this.$_handlers$[$type$$79$$].push($handler$$5$$)
};
$annotorious$events$EventBroker$$.prototype.$removeHandler$ = function $$annotorious$events$EventBroker$$$$$removeHandler$$($type$$80$$, $handler$$6$$) {
  var $handlers$$ = this.$_handlers$[$type$$80$$];
  $handlers$$ && $goog$array$remove$$($handlers$$, $handler$$6$$)
};
$annotorious$events$EventBroker$$.prototype.fireEvent = function $$annotorious$events$EventBroker$$$$fireEvent$($type$$81$$, $opt_event$$) {
  var $cancelEvent$$ = $JSCompiler_alias_FALSE$$, $handlers$$1$$ = this.$_handlers$[$type$$81$$];
  $handlers$$1$$ && $goog$array$forEach$$($handlers$$1$$, function($handler$$7_retVal$$1$$) {
    $handler$$7_retVal$$1$$ = $handler$$7_retVal$$1$$($opt_event$$);
    $goog$isDef$$($handler$$7_retVal$$1$$) && !$handler$$7_retVal$$1$$ && ($cancelEvent$$ = $JSCompiler_alias_TRUE$$)
  });
  return $cancelEvent$$
};
function $goog$structs$Map$$($opt_map$$, $var_args$$68$$) {
  this.$map_$ = {};
  this.$keys_$ = [];
  var $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$ = arguments.length;
  if(1 < $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$) {
    $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$ % 2 && $JSCompiler_alias_THROW$$(Error("Uneven number of arguments"));
    for(var $i$$91_key$$inline_854_values$$inline_458$$ = 0;$i$$91_key$$inline_854_values$$inline_458$$ < $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$;$i$$91_key$$inline_854_values$$inline_458$$ += 2) {
      this.set(arguments[$i$$91_key$$inline_854_values$$inline_458$$], arguments[$i$$91_key$$inline_854_values$$inline_458$$ + 1])
    }
  }else {
    if($opt_map$$) {
      var $key$$inline_849_keys$$inline_457$$;
      if($opt_map$$ instanceof $goog$structs$Map$$) {
        $JSCompiler_StaticMethods_cleanupKeysArray_$$($opt_map$$), $key$$inline_849_keys$$inline_457$$ = $opt_map$$.$keys_$.concat(), $i$$91_key$$inline_854_values$$inline_458$$ = $JSCompiler_StaticMethods_getValues$$($opt_map$$)
      }else {
        var $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$ = [], $i$$inline_848_i$$inline_853$$ = 0;
        for($key$$inline_849_keys$$inline_457$$ in $opt_map$$) {
          $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$[$i$$inline_848_i$$inline_853$$++] = $key$$inline_849_keys$$inline_457$$
        }
        $key$$inline_849_keys$$inline_457$$ = $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$;
        $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$ = [];
        $i$$inline_848_i$$inline_853$$ = 0;
        for($i$$91_key$$inline_854_values$$inline_458$$ in $opt_map$$) {
          $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$[$i$$inline_848_i$$inline_853$$++] = $opt_map$$[$i$$91_key$$inline_854_values$$inline_458$$]
        }
        $i$$91_key$$inline_854_values$$inline_458$$ = $argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$
      }
      for($argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$ = 0;$argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$ < $key$$inline_849_keys$$inline_457$$.length;$argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$++) {
        this.set($key$$inline_849_keys$$inline_457$$[$argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$], $i$$91_key$$inline_854_values$$inline_458$$[$argLength$$2_i$$inline_459_res$$inline_847_res$$inline_852$$])
      }
    }
  }
}
$JSCompiler_prototypeAlias$$ = $goog$structs$Map$$.prototype;
$JSCompiler_prototypeAlias$$.$count_$ = 0;
$JSCompiler_prototypeAlias$$.$version_$ = 0;
function $JSCompiler_StaticMethods_getValues$$($JSCompiler_StaticMethods_getValues$self$$) {
  $JSCompiler_StaticMethods_cleanupKeysArray_$$($JSCompiler_StaticMethods_getValues$self$$);
  for(var $rv$$18$$ = [], $i$$92$$ = 0;$i$$92$$ < $JSCompiler_StaticMethods_getValues$self$$.$keys_$.length;$i$$92$$++) {
    $rv$$18$$.push($JSCompiler_StaticMethods_getValues$self$$.$map_$[$JSCompiler_StaticMethods_getValues$self$$.$keys_$[$i$$92$$]])
  }
  return $rv$$18$$
}
$JSCompiler_prototypeAlias$$.clear = function $$JSCompiler_prototypeAlias$$$clear$() {
  this.$map_$ = {};
  this.$version_$ = this.$count_$ = this.$keys_$.length = 0
};
$JSCompiler_prototypeAlias$$.remove = function $$JSCompiler_prototypeAlias$$$remove$($key$$56$$) {
  return $goog$structs$Map$hasKey_$$(this.$map_$, $key$$56$$) ? (delete this.$map_$[$key$$56$$], this.$count_$--, this.$version_$++, this.$keys_$.length > 2 * this.$count_$ && $JSCompiler_StaticMethods_cleanupKeysArray_$$(this), $JSCompiler_alias_TRUE$$) : $JSCompiler_alias_FALSE$$
};
function $JSCompiler_StaticMethods_cleanupKeysArray_$$($JSCompiler_StaticMethods_cleanupKeysArray_$self$$) {
  if($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$count_$ != $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length) {
    for(var $srcIndex$$ = 0, $destIndex$$ = 0;$srcIndex$$ < $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length;) {
      var $key$$57$$ = $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$[$srcIndex$$];
      $goog$structs$Map$hasKey_$$($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$map_$, $key$$57$$) && ($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$[$destIndex$$++] = $key$$57$$);
      $srcIndex$$++
    }
    $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length = $destIndex$$
  }
  if($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$count_$ != $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length) {
    for(var $seen$$2$$ = {}, $destIndex$$ = $srcIndex$$ = 0;$srcIndex$$ < $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length;) {
      $key$$57$$ = $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$[$srcIndex$$], $goog$structs$Map$hasKey_$$($seen$$2$$, $key$$57$$) || ($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$[$destIndex$$++] = $key$$57$$, $seen$$2$$[$key$$57$$] = 1), $srcIndex$$++
    }
    $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length = $destIndex$$
  }
}
$JSCompiler_prototypeAlias$$.get = function $$JSCompiler_prototypeAlias$$$get$($key$$58$$, $opt_val$$1$$) {
  return $goog$structs$Map$hasKey_$$(this.$map_$, $key$$58$$) ? this.$map_$[$key$$58$$] : $opt_val$$1$$
};
$JSCompiler_prototypeAlias$$.set = function $$JSCompiler_prototypeAlias$$$set$($key$$59$$, $value$$73$$) {
  $goog$structs$Map$hasKey_$$(this.$map_$, $key$$59$$) || (this.$count_$++, this.$keys_$.push($key$$59$$), this.$version_$++);
  this.$map_$[$key$$59$$] = $value$$73$$
};
function $goog$structs$Map$hasKey_$$($obj$$72$$, $key$$63$$) {
  return Object.prototype.hasOwnProperty.call($obj$$72$$, $key$$63$$)
}
;function $annotorious$shape$geom$Point$$($x$$79$$, $y$$46$$) {
  this.x = $x$$79$$;
  this.y = $y$$46$$
}
;function $annotorious$shape$geom$Polygon$$($points$$1$$) {
  this.points = $points$$1$$
}
function $annotorious$shape$geom$Polygon$computeArea$$($points$$2$$) {
  for(var $area$$ = 0, $j$$8$$ = $points$$2$$.length - 1, $i$$99$$ = 0;$i$$99$$ < $points$$2$$.length;$i$$99$$++) {
    $area$$ += ($points$$2$$[$j$$8$$].x + $points$$2$$[$i$$99$$].x) * ($points$$2$$[$j$$8$$].y - $points$$2$$[$i$$99$$].y), $j$$8$$ = $i$$99$$
  }
  return $area$$ / 2
}
function $annotorious$shape$geom$Polygon$_expandTriangle$$($points$$5$$, $delta$$1$$) {
  for(var $centroid_x$$inline_462$$, $expanded_y$$inline_463$$ = $centroid_x$$inline_462$$ = 0, $f$$inline_464_i$$101$$, $j$$inline_465_px$$inline_468$$ = $points$$5$$.length - 1, $JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$ = 0;$JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$ < $points$$5$$.length;$JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$++) {
    $f$$inline_464_i$$101$$ = $points$$5$$[$JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$].x * $points$$5$$[$j$$inline_465_px$$inline_468$$].y - $points$$5$$[$j$$inline_465_px$$inline_468$$].x * $points$$5$$[$JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$].y, $centroid_x$$inline_462$$ += ($points$$5$$[$JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$].x + $points$$5$$[$j$$inline_465_px$$inline_468$$].x) * $f$$inline_464_i$$101$$, $expanded_y$$inline_463$$ += ($points$$5$$[$JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$].y +
    $points$$5$$[$j$$inline_465_px$$inline_468$$].y) * $f$$inline_464_i$$101$$, $j$$inline_465_px$$inline_468$$ = $JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$
  }
  $f$$inline_464_i$$101$$ = 6 * $annotorious$shape$geom$Polygon$computeArea$$($points$$5$$);
  $centroid_x$$inline_462$$ = new $annotorious$shape$geom$Point$$(Math.abs($centroid_x$$inline_462$$ / $f$$inline_464_i$$101$$), Math.abs($expanded_y$$inline_463$$ / $f$$inline_464_i$$101$$));
  $expanded_y$$inline_463$$ = [];
  for($f$$inline_464_i$$101$$ = 0;$f$$inline_464_i$$101$$ < $points$$5$$.length;$f$$inline_464_i$$101$$++) {
    var $j$$inline_465_px$$inline_468$$ = $points$$5$$[$f$$inline_464_i$$101$$], $delta$$inline_470_dy$$inline_474$$ = (0 > $annotorious$shape$geom$Polygon$computeArea$$($points$$5$$) ? -1 : 1) * $delta$$1$$, $JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$ = $j$$inline_465_px$$inline_468$$.x - $centroid_x$$inline_462$$.x, $JSCompiler_object_inline_y_1$$inline_472$$ = $j$$inline_465_px$$inline_468$$.y - $centroid_x$$inline_462$$.y, $sign_delta$$inline_473$$ = 0 < $delta$$inline_470_dy$$inline_474$$ ?
    1 : 0 > $delta$$inline_470_dy$$inline_474$$ ? -1 : 0, $delta$$inline_470_dy$$inline_474$$ = Math.sqrt(Math.pow($delta$$inline_470_dy$$inline_474$$, 2) / (1 + Math.pow($JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$ / $JSCompiler_object_inline_y_1$$inline_472$$, 2)));
    $expanded_y$$inline_463$$.push({x:$j$$inline_465_px$$inline_468$$.x + Math.abs($JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$ / $JSCompiler_object_inline_y_1$$inline_472$$ * $delta$$inline_470_dy$$inline_474$$) * (0 < $JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$ ? 1 : 0 > $JSCompiler_object_inline_x_0$$inline_471_i$$inline_466$$ ? -1 : 0) * $sign_delta$$inline_473$$, y:$j$$inline_465_px$$inline_468$$.y + Math.abs($delta$$inline_470_dy$$inline_474$$) * (0 < $JSCompiler_object_inline_y_1$$inline_472$$ ?
    1 : 0 > $JSCompiler_object_inline_y_1$$inline_472$$ ? -1 : 0) * $sign_delta$$inline_473$$})
  }
  return $expanded_y$$inline_463$$
}
;function $annotorious$shape$geom$Rectangle$$($x$$81$$, $y$$48$$, $width$$19$$, $height$$18$$) {
  0 < $width$$19$$ ? (this.x = $x$$81$$, this.width = $width$$19$$) : (this.x = $x$$81$$ + $width$$19$$, this.width = -$width$$19$$);
  0 < $height$$18$$ ? (this.y = $y$$48$$, this.height = $height$$18$$) : (this.y = $y$$48$$ + $height$$18$$, this.height = -$height$$18$$)
}
;function $annotorious$shape$Shape$$($type$$82$$, $geometry$$) {
  this.type = $type$$82$$;
  this.geometry = $geometry$$
}
function $annotorious$shape$getSize$$($shape$$1$$) {
  return"rect" == $shape$$1$$.type ? $shape$$1$$.geometry.width * $shape$$1$$.geometry.height : "polygon" == $shape$$1$$.type ? Math.abs($annotorious$shape$geom$Polygon$computeArea$$($shape$$1$$.geometry.points)) : 0
}
function $annotorious$shape$getBoundingRect$$($points$$8_shape$$2$$) {
  if("rect" == $points$$8_shape$$2$$.type) {
    return $points$$8_shape$$2$$
  }
  if("polygon" == $points$$8_shape$$2$$.type) {
    for(var $points$$8_shape$$2$$ = $points$$8_shape$$2$$.geometry.points, $left$$13$$ = $points$$8_shape$$2$$[0].x, $right$$11$$ = $points$$8_shape$$2$$[0].x, $top$$11$$ = $points$$8_shape$$2$$[0].y, $bottom$$7$$ = $points$$8_shape$$2$$[0].y, $i$$103$$ = 1;$i$$103$$ < $points$$8_shape$$2$$.length;$i$$103$$++) {
      $points$$8_shape$$2$$[$i$$103$$].x > $right$$11$$ && ($right$$11$$ = $points$$8_shape$$2$$[$i$$103$$].x), $points$$8_shape$$2$$[$i$$103$$].x < $left$$13$$ && ($left$$13$$ = $points$$8_shape$$2$$[$i$$103$$].x), $points$$8_shape$$2$$[$i$$103$$].y > $bottom$$7$$ && ($bottom$$7$$ = $points$$8_shape$$2$$[$i$$103$$].y), $points$$8_shape$$2$$[$i$$103$$].y < $top$$11$$ && ($top$$11$$ = $points$$8_shape$$2$$[$i$$103$$].y)
    }
    return new $annotorious$shape$Shape$$("rect", new $annotorious$shape$geom$Rectangle$$($left$$13$$, $top$$11$$, $right$$11$$ - $left$$13$$, $bottom$$7$$ - $top$$11$$))
  }
}
function $annotorious$shape$expand$$($shape$$4$$, $delta$$4$$) {
  var $JSCompiler_inline_result$$34_points$$inline_476$$;
  $JSCompiler_inline_result$$34_points$$inline_476$$ = $shape$$4$$.geometry.points;
  var $sign$$inline_478$$ = 0 > $annotorious$shape$geom$Polygon$computeArea$$($JSCompiler_inline_result$$34_points$$inline_476$$) ? -1 : 1;
  if(4 > $JSCompiler_inline_result$$34_points$$inline_476$$.length) {
    $JSCompiler_inline_result$$34_points$$inline_476$$ = $annotorious$shape$geom$Polygon$_expandTriangle$$($JSCompiler_inline_result$$34_points$$inline_476$$, $sign$$inline_478$$ * $delta$$4$$)
  }else {
    for(var $expTriangle$$inline_483_prev$$inline_479$$ = $JSCompiler_inline_result$$34_points$$inline_476$$.length - 1, $next$$inline_480$$ = 1, $expanded$$inline_481$$ = [], $current$$inline_482$$ = 0;$current$$inline_482$$ < $JSCompiler_inline_result$$34_points$$inline_476$$.length;$current$$inline_482$$++) {
      $expTriangle$$inline_483_prev$$inline_479$$ = $annotorious$shape$geom$Polygon$_expandTriangle$$([$JSCompiler_inline_result$$34_points$$inline_476$$[$expTriangle$$inline_483_prev$$inline_479$$], $JSCompiler_inline_result$$34_points$$inline_476$$[$current$$inline_482$$], $JSCompiler_inline_result$$34_points$$inline_476$$[$next$$inline_480$$]], $sign$$inline_478$$ * $delta$$4$$), $expanded$$inline_481$$.push($expTriangle$$inline_483_prev$$inline_479$$[1]), $expTriangle$$inline_483_prev$$inline_479$$ =
      $current$$inline_482$$, $next$$inline_480$$++, $next$$inline_480$$ > $JSCompiler_inline_result$$34_points$$inline_476$$.length - 1 && ($next$$inline_480$$ = 0)
    }
    $JSCompiler_inline_result$$34_points$$inline_476$$ = $expanded$$inline_481$$
  }
  return new $annotorious$shape$Shape$$("polygon", new $annotorious$shape$geom$Polygon$$($JSCompiler_inline_result$$34_points$$inline_476$$))
}
function $annotorious$shape$transform$$($shape$$5$$, $transformationFn$$) {
  if("rect" == $shape$$5$$.type) {
    var $geom_opposite$$ = $shape$$5$$.geometry, $anchor$$ = $transformationFn$$({x:$geom_opposite$$.x, y:$geom_opposite$$.y}), $geom_opposite$$ = $transformationFn$$({x:$geom_opposite$$.x + $geom_opposite$$.width, y:$geom_opposite$$.y + $geom_opposite$$.height});
    return new $annotorious$shape$Shape$$("rect", new $annotorious$shape$geom$Rectangle$$($anchor$$.x, $anchor$$.y, $geom_opposite$$.x - $anchor$$.x, $geom_opposite$$.y - $anchor$$.y))
  }
  if("polygon" == $shape$$5$$.type) {
    var $transformedPoints$$ = [];
    $goog$array$forEach$$($shape$$5$$.geometry.points, function($pt$$) {
      $transformedPoints$$.push($transformationFn$$($pt$$))
    });
    return new $annotorious$shape$Shape$$("polygon", new $annotorious$shape$geom$Polygon$$($transformedPoints$$))
  }
}
function $annotorious$shape$hashCode$$($shape$$6$$) {
  return JSON.stringify($shape$$6$$.geometry)
}
window.annotorious || (window.annotorious = {});
window.annotorious.geometry || (window.annotorious.geometry = {}, window.annotorious.geometry.expand = $annotorious$shape$expand$$);
function $annotorious$annotation$Annotation$$($src$$21$$, $text$$10$$, $shape$$7$$) {
  this.src = $src$$21$$;
  this.text = $text$$10$$;
  this.shapes = [$shape$$7$$];
  this.context = document.URL
}
;function $annotorious$modules$Module$$() {
}
function $JSCompiler_StaticMethods__initFields$$($JSCompiler_StaticMethods__initFields$self$$, $opt_preload_fn$$) {
  $JSCompiler_StaticMethods__initFields$self$$.$_annotators$ = new $goog$structs$Map$$;
  $JSCompiler_StaticMethods__initFields$self$$.$_eventHandlers$ = [];
  $JSCompiler_StaticMethods__initFields$self$$.$_plugins$ = [];
  $JSCompiler_StaticMethods__initFields$self$$.$_itemsToLoad$ = [];
  $JSCompiler_StaticMethods__initFields$self$$.$_bufferedForAdding$ = [];
  $JSCompiler_StaticMethods__initFields$self$$.$_bufferedForRemoval$ = [];
  $JSCompiler_StaticMethods__initFields$self$$.$_cachedGlobalSettings$ = {$hide_selection_widget$:$JSCompiler_alias_FALSE$$, $hide_annotations$:$JSCompiler_alias_FALSE$$};
  $JSCompiler_StaticMethods__initFields$self$$.$_cachedItemSettings$ = new $goog$structs$Map$$;
  $JSCompiler_StaticMethods__initFields$self$$.$_preLoad$ = $opt_preload_fn$$
}
function $JSCompiler_StaticMethods__getSettings$$($JSCompiler_StaticMethods__getSettings$self$$, $item_url$$) {
  var $settings$$ = $JSCompiler_StaticMethods__getSettings$self$$.$_cachedItemSettings$($item_url$$);
  $settings$$ || ($settings$$ = {$hide_selection_widget$:$JSCompiler_alias_FALSE$$, $hide_annotations$:$JSCompiler_alias_FALSE$$}, $settings$$.set($item_url$$, $settings$$));
  return $settings$$
}
function $JSCompiler_StaticMethods__initAnnotator$$($JSCompiler_StaticMethods__initAnnotator$self$$, $item$$1$$) {
  var $item_src$$ = $JSCompiler_StaticMethods__initAnnotator$self$$.$getItemURL$($item$$1$$);
  if(!$JSCompiler_StaticMethods__initAnnotator$self$$.$_annotators$.get($item_src$$)) {
    var $annotator$$1$$ = $JSCompiler_StaticMethods__initAnnotator$self$$.$newAnnotator$($item$$1$$), $addedAnnotations$$ = [], $removedAnnotations$$ = [];
    $goog$array$forEach$$($JSCompiler_StaticMethods__initAnnotator$self$$.$_eventHandlers$, function($eventHandler$$) {
      $annotator$$1$$.$addHandler$($eventHandler$$.type, $eventHandler$$.$handler$)
    });
    $goog$array$forEach$$($JSCompiler_StaticMethods__initAnnotator$self$$.$_plugins$, function($plugin$$) {
      if($plugin$$.onInitAnnotator) {
        $plugin$$.onInitAnnotator($annotator$$1$$)
      }
    });
    $goog$array$forEach$$($JSCompiler_StaticMethods__initAnnotator$self$$.$_bufferedForAdding$, function($annotation$$) {
      $annotation$$.src == $item_src$$ && ($annotator$$1$$.$addAnnotation$($annotation$$), $addedAnnotations$$.push($annotation$$))
    });
    $goog$array$forEach$$($JSCompiler_StaticMethods__initAnnotator$self$$.$_bufferedForRemoval$, function($annotation$$1$$) {
      $annotation$$1$$.src == $item_src$$ && ($annotator$$1$$.$removeAnnotation$($annotation$$1$$), $removedAnnotations$$.push($annotation$$1$$))
    });
    $goog$array$forEach$$($addedAnnotations$$, function($annotation$$2$$) {
      $goog$array$remove$$($JSCompiler_StaticMethods__initAnnotator$self$$.$_bufferedForAdding$, $annotation$$2$$)
    });
    $goog$array$forEach$$($removedAnnotations$$, function($annotation$$3$$) {
      $goog$array$remove$$($JSCompiler_StaticMethods__initAnnotator$self$$.$_bufferedForRemoval$, $annotation$$3$$)
    });
    var $settings$$1$$ = $JSCompiler_StaticMethods__initAnnotator$self$$.$_cachedItemSettings$.get($item_src$$);
    $settings$$1$$ ? ($settings$$1$$.$hide_selection_widget$ && $annotator$$1$$.$hideSelectionWidget$(), $settings$$1$$.$hide_annotations$ && $annotator$$1$$.$hideAnnotations$(), $JSCompiler_StaticMethods__initAnnotator$self$$.$_cachedItemSettings$.remove($item_src$$)) : ($JSCompiler_StaticMethods__initAnnotator$self$$.$_cachedGlobalSettings$.$hide_selection_widget$ && $annotator$$1$$.$hideSelectionWidget$(), $JSCompiler_StaticMethods__initAnnotator$self$$.$_cachedGlobalSettings$.$hide_annotations$ &&
    $annotator$$1$$.$hideAnnotations$());
    $JSCompiler_StaticMethods__initAnnotator$self$$.$_annotators$.set($item_src$$, $annotator$$1$$);
    $goog$array$remove$$($JSCompiler_StaticMethods__initAnnotator$self$$.$_itemsToLoad$, $item$$1$$)
  }
}
function $JSCompiler_StaticMethods__lazyLoad$$($JSCompiler_StaticMethods__lazyLoad$self$$) {
  $goog$array$forEach$$($JSCompiler_StaticMethods__lazyLoad$self$$.$_itemsToLoad$, function($item$$2$$) {
    for(var $el$$inline_488$$ = $item$$2$$, $top$$inline_489$$ = $el$$inline_488$$.offsetTop, $left$$inline_490$$ = $el$$inline_488$$.offsetLeft, $width$$inline_491$$ = $el$$inline_488$$.offsetWidth, $height$$inline_492$$ = $el$$inline_488$$.offsetHeight;$el$$inline_488$$.offsetParent;) {
      $el$$inline_488$$ = $el$$inline_488$$.offsetParent, $top$$inline_489$$ += $el$$inline_488$$.offsetTop, $left$$inline_490$$ += $el$$inline_488$$.offsetLeft
    }
    $top$$inline_489$$ < window.pageYOffset + window.innerHeight && ($left$$inline_490$$ < window.pageXOffset + window.innerWidth && $top$$inline_489$$ + $height$$inline_492$$ > window.pageYOffset && $left$$inline_490$$ + $width$$inline_491$$ > window.pageXOffset) && $JSCompiler_StaticMethods__initAnnotator$$($JSCompiler_StaticMethods__lazyLoad$self$$, $item$$2$$)
  })
}
function $JSCompiler_StaticMethods__setAnnotationVisibility$$($JSCompiler_StaticMethods__setAnnotationVisibility$self$$, $opt_item_url$$, $visibility$$) {
  if($opt_item_url$$) {
    var $annotator$$3$$ = $JSCompiler_StaticMethods__setAnnotationVisibility$self$$.$_annotators$.get($opt_item_url$$);
    $annotator$$3$$ ? $visibility$$ ? $annotator$$3$$.$showAnnotations$() : $annotator$$3$$.$hideAnnotations$() : $JSCompiler_StaticMethods__getSettings$$($JSCompiler_StaticMethods__setAnnotationVisibility$self$$, $opt_item_url$$).$hide_annotations$ = $visibility$$
  }else {
    $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$($JSCompiler_StaticMethods__setAnnotationVisibility$self$$.$_annotators$), function($annotator$$4$$) {
      $visibility$$ ? $annotator$$4$$.$showAnnotations$() : $annotator$$4$$.$hideAnnotations$()
    }), $JSCompiler_StaticMethods__setAnnotationVisibility$self$$.$_cachedGlobalSettings$.$hide_annotations$ = $visibility$$, $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$($JSCompiler_StaticMethods__setAnnotationVisibility$self$$.$_cachedItemSettings$), function($settings$$2$$) {
      $settings$$2$$.$hide_annotations$ = $visibility$$
    })
  }
}
function $JSCompiler_StaticMethods__setSelectionWidgetVisibility$$($JSCompiler_StaticMethods__setSelectionWidgetVisibility$self$$, $opt_item_url$$1$$, $visibility$$1$$) {
  if($opt_item_url$$1$$) {
    var $annotator$$5$$ = $JSCompiler_StaticMethods__setSelectionWidgetVisibility$self$$.$_annotators$.get($opt_item_url$$1$$);
    $annotator$$5$$ ? $visibility$$1$$ ? $annotator$$5$$.$showSelectionWidget$() : $annotator$$5$$.$hideSelectionWidget$() : $JSCompiler_StaticMethods__getSettings$$($JSCompiler_StaticMethods__setSelectionWidgetVisibility$self$$, $opt_item_url$$1$$).$hide_selection_widget$ = $visibility$$1$$
  }else {
    $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$($JSCompiler_StaticMethods__setSelectionWidgetVisibility$self$$.$_annotators$), function($annotator$$6$$) {
      $visibility$$1$$ ? $annotator$$6$$.$showSelectionWidget$() : $annotator$$6$$.$hideSelectionWidget$()
    }), $JSCompiler_StaticMethods__setSelectionWidgetVisibility$self$$.$_cachedGlobalSettings$.$hide_selection_widget$ = $visibility$$1$$, $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$($JSCompiler_StaticMethods__setSelectionWidgetVisibility$self$$.$_cachedItemSettings$), function($settings$$3$$) {
      $settings$$3$$.$hide_selection_widget$ = $visibility$$1$$
    })
  }
}
$JSCompiler_prototypeAlias$$ = $annotorious$modules$Module$$.prototype;
$JSCompiler_prototypeAlias$$.$activateSelector$ = function $$JSCompiler_prototypeAlias$$$$activateSelector$$($opt_item_url_or_callback$$, $opt_callback$$5$$) {
  var $annotator$$7_item_url$$1$$ = $JSCompiler_alias_VOID$$, $callback$$34$$ = $JSCompiler_alias_VOID$$;
  $goog$isString$$($opt_item_url_or_callback$$) ? ($annotator$$7_item_url$$1$$ = $opt_item_url_or_callback$$, $callback$$34$$ = $opt_callback$$5$$) : $goog$isFunction$$($opt_item_url_or_callback$$) && ($callback$$34$$ = $opt_item_url_or_callback$$);
  $annotator$$7_item_url$$1$$ ? ($annotator$$7_item_url$$1$$ = this.$_annotators$.get($annotator$$7_item_url$$1$$)) && $annotator$$7_item_url$$1$$.$activateSelector$($callback$$34$$) : $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$(this.$_annotators$), function($annotator$$8$$) {
    $annotator$$8$$.$activateSelector$($callback$$34$$)
  })
};
$JSCompiler_prototypeAlias$$.$addAnnotation$ = function $$JSCompiler_prototypeAlias$$$$addAnnotation$$($annotation$$4$$, $opt_replace$$1$$) {
  if($JSCompiler_StaticMethods_annotatesItem$$(this, $annotation$$4$$.src)) {
    var $annotator$$9$$ = this.$_annotators$.get($annotation$$4$$.src);
    $annotator$$9$$ ? $annotator$$9$$.$addAnnotation$($annotation$$4$$, $opt_replace$$1$$) : (this.$_bufferedForAdding$.push($annotation$$4$$), $opt_replace$$1$$ && $goog$array$remove$$(this.$_bufferedForAdding$, $opt_replace$$1$$))
  }
};
$JSCompiler_prototypeAlias$$.$addHandler$ = function $$JSCompiler_prototypeAlias$$$$addHandler$$($type$$83$$, $handler$$8$$) {
  $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$(this.$_annotators$), function($annotator$$10$$) {
    $annotator$$10$$.$addHandler$($type$$83$$, $handler$$8$$)
  });
  this.$_eventHandlers$.push({type:$type$$83$$, $handler$:$handler$$8$$})
};
$JSCompiler_prototypeAlias$$.$addPlugin$ = function $$JSCompiler_prototypeAlias$$$$addPlugin$$($plugin$$2$$) {
  this.$_plugins$.push($plugin$$2$$);
  $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$(this.$_annotators$), function($annotator$$11$$) {
    if($plugin$$2$$.onInitAnnotator) {
      $plugin$$2$$.onInitAnnotator($annotator$$11$$)
    }
  })
};
$JSCompiler_prototypeAlias$$.$addSelector$ = function $$JSCompiler_prototypeAlias$$$$addSelector$$($item_url$$2$$, $selector$$2$$) {
  if($JSCompiler_StaticMethods_annotatesItem$$(this, $item_url$$2$$)) {
    var $annotator$$12$$ = this.$_annotators$.get($item_url$$2$$);
    $annotator$$12$$ && $annotator$$12$$.$addSelector$($selector$$2$$)
  }
};
function $JSCompiler_StaticMethods_annotatesItem$$($JSCompiler_StaticMethods_annotatesItem$self$$, $item_url$$3$$) {
  return $goog$structs$Map$hasKey_$$($JSCompiler_StaticMethods_annotatesItem$self$$.$_annotators$.$map_$, $item_url$$3$$) ? $JSCompiler_alias_TRUE$$ : $goog$array$find$$($JSCompiler_StaticMethods_annotatesItem$self$$.$_itemsToLoad$, function($item$$4$$) {
    return $JSCompiler_StaticMethods_annotatesItem$self$$.$getItemURL$($item$$4$$) == $item_url$$3$$
  }) != $JSCompiler_alias_NULL$$
}
$JSCompiler_prototypeAlias$$.$destroy$ = function $$JSCompiler_prototypeAlias$$$$destroy$$() {
  $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$(this.$_annotators$), function($annotator$$13$$) {
    $annotator$$13$$.$destroy$()
  });
  this.$_annotators$.clear()
};
$JSCompiler_prototypeAlias$$.$getActiveSelector$ = function $$JSCompiler_prototypeAlias$$$$getActiveSelector$$($annotator$$14_item_url$$4$$) {
  if($JSCompiler_StaticMethods_annotatesItem$$(this, $annotator$$14_item_url$$4$$) && ($annotator$$14_item_url$$4$$ = this.$_annotators$.get($annotator$$14_item_url$$4$$))) {
    return $annotator$$14_item_url$$4$$.$getActiveSelector$().getName()
  }
};
$JSCompiler_prototypeAlias$$.$getAnnotations$ = function $$JSCompiler_prototypeAlias$$$$getAnnotations$$($opt_item_url$$2$$) {
  if($opt_item_url$$2$$) {
    var $annotator$$15$$ = this.$_annotators$.get($opt_item_url$$2$$);
    return $annotator$$15$$ ? $annotator$$15$$.$getAnnotations$() : $goog$array$filter$$(this.$_bufferedForAdding$, function($annotation$$5$$) {
      return $annotation$$5$$.src == $opt_item_url$$2$$
    })
  }
  var $annotations$$ = [];
  $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$(this.$_annotators$), function($annotator$$16$$) {
    $goog$array$extend$$($annotations$$, $annotator$$16$$.$getAnnotations$())
  });
  $goog$array$extend$$($annotations$$, this.$_bufferedForAdding$);
  return $annotations$$
};
$JSCompiler_prototypeAlias$$.$getAvailableSelectors$ = function $$JSCompiler_prototypeAlias$$$$getAvailableSelectors$$($annotator$$17_item_url$$5$$) {
  if($JSCompiler_StaticMethods_annotatesItem$$(this, $annotator$$17_item_url$$5$$) && ($annotator$$17_item_url$$5$$ = this.$_annotators$.get($annotator$$17_item_url$$5$$))) {
    return $goog$array$map$$($annotator$$17_item_url$$5$$.$getAvailableSelectors$(), function($selector$$3$$) {
      return $selector$$3$$.getName()
    })
  }
};
$JSCompiler_prototypeAlias$$.$hideAnnotations$ = function $$JSCompiler_prototypeAlias$$$$hideAnnotations$$($opt_item_url$$3$$) {
  $JSCompiler_StaticMethods__setAnnotationVisibility$$(this, $opt_item_url$$3$$, $JSCompiler_alias_FALSE$$)
};
$JSCompiler_prototypeAlias$$.$hideSelectionWidget$ = function $$JSCompiler_prototypeAlias$$$$hideSelectionWidget$$($opt_item_url$$4$$) {
  $JSCompiler_StaticMethods__setSelectionWidgetVisibility$$(this, $opt_item_url$$4$$, $JSCompiler_alias_FALSE$$)
};
$JSCompiler_prototypeAlias$$.$highlightAnnotation$ = function $$JSCompiler_prototypeAlias$$$$highlightAnnotation$$($annotation$$6$$) {
  if($annotation$$6$$) {
    if($JSCompiler_StaticMethods_annotatesItem$$(this, $annotation$$6$$.src)) {
      var $annotator$$18$$ = this.$_annotators$.get($annotation$$6$$.src);
      $annotator$$18$$ && $annotator$$18$$.$highlightAnnotation$($annotation$$6$$)
    }
  }else {
    $goog$array$forEach$$($JSCompiler_StaticMethods_getValues$$(this.$_annotators$), function($annotator$$19$$) {
      $annotator$$19$$.$highlightAnnotation$()
    })
  }
};
$JSCompiler_prototypeAlias$$.init = function $$JSCompiler_prototypeAlias$$$init$() {
  this.$_preLoad$ && $goog$array$extend$$(this.$_itemsToLoad$, this.$_preLoad$());
  $JSCompiler_StaticMethods__lazyLoad$$(this);
  var $self$$5$$ = this, $key$$64$$ = $goog$events$listen$$(window, "scroll", function() {
    0 < $self$$5$$.$_itemsToLoad$.length ? $JSCompiler_StaticMethods__lazyLoad$$($self$$5$$) : $goog$events$unlistenByKey$$($key$$64$$)
  })
};
$JSCompiler_prototypeAlias$$.$makeAnnotatable$ = function $$JSCompiler_prototypeAlias$$$$makeAnnotatable$$($item$$5$$) {
  this.$supports$($item$$5$$) && $JSCompiler_StaticMethods__initAnnotator$$(this, $item$$5$$)
};
$JSCompiler_prototypeAlias$$.$removeAnnotation$ = function $$JSCompiler_prototypeAlias$$$$removeAnnotation$$($annotation$$7$$) {
  if($JSCompiler_StaticMethods_annotatesItem$$(this, $annotation$$7$$.src)) {
    var $annotator$$20$$ = this.$_annotators$.get($annotation$$7$$.src);
    $annotator$$20$$ ? $annotator$$20$$.$removeAnnotation$($annotation$$7$$) : this.$_bufferedForRemoval$.push($annotation$$7$$)
  }
};
$JSCompiler_prototypeAlias$$.$setActiveSelector$ = function $$JSCompiler_prototypeAlias$$$$setActiveSelector$$($item_url$$6$$, $selector$$4$$) {
  if($JSCompiler_StaticMethods_annotatesItem$$(this, $item_url$$6$$)) {
    var $annotator$$21$$ = this.$_annotators$.get($item_url$$6$$);
    $annotator$$21$$ && $annotator$$21$$.$setActiveSelector$($selector$$4$$)
  }
};
$JSCompiler_prototypeAlias$$.$showAnnotations$ = function $$JSCompiler_prototypeAlias$$$$showAnnotations$$($opt_item_url$$5$$) {
  $JSCompiler_StaticMethods__setAnnotationVisibility$$(this, $opt_item_url$$5$$, $JSCompiler_alias_TRUE$$)
};
$JSCompiler_prototypeAlias$$.$showSelectionWidget$ = function $$JSCompiler_prototypeAlias$$$$showSelectionWidget$$($opt_item_url$$6$$) {
  $JSCompiler_StaticMethods__setSelectionWidgetVisibility$$(this, $opt_item_url$$6$$, $JSCompiler_alias_TRUE$$)
};
function $goog$soy$renderAsElement$$($template$$2$$, $opt_templateData$$2$$) {
  var $wrapper$$4$$ = $goog$dom$getDomHelper$$().createElement("DIV");
  $wrapper$$4$$.innerHTML = $template$$2$$($opt_templateData$$2$$ || $goog$soy$defaultTemplateData_$$, $JSCompiler_alias_VOID$$, $JSCompiler_alias_VOID$$);
  if(1 == $wrapper$$4$$.childNodes.length) {
    var $firstChild$$ = $wrapper$$4$$.firstChild;
    if(1 == $firstChild$$.nodeType) {
      return $firstChild$$
    }
  }
  return $wrapper$$4$$
}
var $goog$soy$defaultTemplateData_$$ = {};
function $annotorious$modules$image$Viewer$$($canvas$$, $popup$$, $annotator$$22$$) {
  this.$_canvas$ = $canvas$$;
  this.$_popup$ = $popup$$;
  this.$_annotator$ = $annotator$$22$$;
  this.$_annotations$ = [];
  this.$_shapes$ = [];
  this.$_g2d$ = this.$_canvas$.getContext("2d");
  this.$_eventsEnabled$ = $JSCompiler_alias_TRUE$$;
  this.$_keepHighlighted$ = $JSCompiler_alias_FALSE$$;
  var $self$$6$$ = this;
  $goog$events$listen$$(this.$_canvas$, "mousemove", function($event$$4$$) {
    if($self$$6$$.$_eventsEnabled$) {
      var $topAnnotation$$inline_499$$ = $JSCompiler_StaticMethods_topAnnotationAt$$($self$$6$$, $event$$4$$.offsetX, $event$$4$$.offsetY);
      $topAnnotation$$inline_499$$ ? ($self$$6$$.$_keepHighlighted$ = $JSCompiler_alias_FALSE$$, $self$$6$$.$_currentAnnotation$ ? $self$$6$$.$_currentAnnotation$ != $topAnnotation$$inline_499$$ && ($self$$6$$.$_eventsEnabled$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_startHideTimer$$($self$$6$$.$_popup$)) : ($self$$6$$.$_currentAnnotation$ = $topAnnotation$$inline_499$$, $JSCompiler_StaticMethods__redraw$$($self$$6$$), $self$$6$$.$_annotator$.fireEvent("onMouseOverAnnotation", {$annotation$:$self$$6$$.$_currentAnnotation$,
      mouseEvent:$event$$4$$}))) : !$self$$6$$.$_keepHighlighted$ && $self$$6$$.$_currentAnnotation$ && ($self$$6$$.$_eventsEnabled$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_startHideTimer$$($self$$6$$.$_popup$))
    }else {
      $self$$6$$.$_cachedMouseEvent$ = $event$$4$$
    }
  });
  $annotator$$22$$.$addHandler$("onMouseOutOfItem", function() {
    delete $self$$6$$.$_currentAnnotation$;
    $self$$6$$.$_eventsEnabled$ = $JSCompiler_alias_TRUE$$
  });
  $annotator$$22$$.$addHandler$("beforePopupHide", function() {
    if(!$self$$6$$.$_eventsEnabled$ && $self$$6$$.$_cachedMouseEvent$) {
      var $previousAnnotation$$ = $self$$6$$.$_currentAnnotation$;
      $self$$6$$.$_currentAnnotation$ = $JSCompiler_StaticMethods_topAnnotationAt$$($self$$6$$, $self$$6$$.$_cachedMouseEvent$.offsetX, $self$$6$$.$_cachedMouseEvent$.offsetY);
      $self$$6$$.$_eventsEnabled$ = $JSCompiler_alias_TRUE$$;
      $previousAnnotation$$ != $self$$6$$.$_currentAnnotation$ ? ($JSCompiler_StaticMethods__redraw$$($self$$6$$), $self$$6$$.$_annotator$.fireEvent("onMouseOutOfAnnotation", {$annotation$:$previousAnnotation$$, mouseEvent:$self$$6$$.$_cachedMouseEvent$}), $self$$6$$.$_annotator$.fireEvent("onMouseOverAnnotation", {$annotation$:$self$$6$$.$_currentAnnotation$, mouseEvent:$self$$6$$.$_cachedMouseEvent$})) : $self$$6$$.$_currentAnnotation$ && $JSCompiler_StaticMethods_clearHideTimer$$($self$$6$$.$_popup$)
    }else {
      $JSCompiler_StaticMethods__redraw$$($self$$6$$)
    }
  })
}
$JSCompiler_prototypeAlias$$ = $annotorious$modules$image$Viewer$$.prototype;
$JSCompiler_prototypeAlias$$.$addAnnotation$ = function $$JSCompiler_prototypeAlias$$$$addAnnotation$$($annotation$$8$$, $opt_replace$$2$$) {
  $opt_replace$$2$$ && ($opt_replace$$2$$ == this.$_currentAnnotation$ && delete this.$_currentAnnotation$, $goog$array$remove$$(this.$_annotations$, $opt_replace$$2$$), delete this.$_shapes$[$annotorious$shape$hashCode$$($opt_replace$$2$$.shapes[0])]);
  this.$_annotations$.push($annotation$$8$$);
  var $shape$$8_viewportShape$$ = $annotation$$8$$.shapes[0];
  if("pixel" != $shape$$8_viewportShape$$.units) {
    var $self$$7$$ = this, $shape$$8_viewportShape$$ = $annotorious$shape$transform$$($shape$$8_viewportShape$$, function($xy$$) {
      return $self$$7$$.$_annotator$.$fromItemCoordinates$($xy$$)
    })
  }
  this.$_shapes$[$annotorious$shape$hashCode$$($annotation$$8$$.shapes[0])] = $shape$$8_viewportShape$$;
  $JSCompiler_StaticMethods__redraw$$(this)
};
$JSCompiler_prototypeAlias$$.$removeAnnotation$ = function $$JSCompiler_prototypeAlias$$$$removeAnnotation$$($annotation$$9$$) {
  $annotation$$9$$ == this.$_currentAnnotation$ && delete this.$_currentAnnotation$;
  $goog$array$remove$$(this.$_annotations$, $annotation$$9$$);
  delete this.$_shapes$[$annotorious$shape$hashCode$$($annotation$$9$$.shapes[0])];
  $JSCompiler_StaticMethods__redraw$$(this)
};
$JSCompiler_prototypeAlias$$.$getAnnotations$ = function $$JSCompiler_prototypeAlias$$$$getAnnotations$$() {
  return $goog$array$toArray$$(this.$_annotations$)
};
$JSCompiler_prototypeAlias$$.$highlightAnnotation$ = function $$JSCompiler_prototypeAlias$$$$highlightAnnotation$$($opt_annotation$$) {
  (this.$_currentAnnotation$ = $opt_annotation$$) ? this.$_keepHighlighted$ = $JSCompiler_alias_TRUE$$ : $JSCompiler_StaticMethods_startHideTimer$$(this.$_popup$);
  $JSCompiler_StaticMethods__redraw$$(this)
};
function $JSCompiler_StaticMethods_topAnnotationAt$$($JSCompiler_StaticMethods_topAnnotationAt$self_annotations$$1$$, $px$$2$$, $py$$1$$) {
  $JSCompiler_StaticMethods_topAnnotationAt$self_annotations$$1$$ = $JSCompiler_StaticMethods_topAnnotationAt$self_annotations$$1$$.$getAnnotationsAt$($px$$2$$, $py$$1$$);
  if(0 < $JSCompiler_StaticMethods_topAnnotationAt$self_annotations$$1$$.length) {
    return $JSCompiler_StaticMethods_topAnnotationAt$self_annotations$$1$$[0]
  }
}
$JSCompiler_prototypeAlias$$.$getAnnotationsAt$ = function $$JSCompiler_prototypeAlias$$$$getAnnotationsAt$$($px$$3$$, $py$$2$$) {
  var $intersectedAnnotations$$ = [], $self$$8$$ = this;
  $goog$array$forEach$$(this.$_annotations$, function($annotation$$10$$) {
    var $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$;
    $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$ = $self$$8$$.$_shapes$[$annotorious$shape$hashCode$$($annotation$$10$$.shapes[0])];
    if("rect" == $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.type) {
      $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$ = $px$$3$$ < $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.geometry.x || $py$$2$$ < $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.geometry.y || $px$$3$$ > $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.geometry.x + $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.geometry.width || $py$$2$$ > $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.geometry.y +
      $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.geometry.height ? $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_TRUE$$
    }else {
      if("polygon" == $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.type) {
        $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$ = $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.geometry.points;
        for(var $inside$$inline_505$$ = $JSCompiler_alias_FALSE$$, $j$$inline_506$$ = $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.length - 1, $i$$inline_507$$ = 0;$i$$inline_507$$ < $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$.length;$i$$inline_507$$++) {
          $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$[$i$$inline_507$$].y > $py$$2$$ != $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$[$j$$inline_506$$].y > $py$$2$$ && $px$$3$$ < ($JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$[$j$$inline_506$$].x - $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$[$i$$inline_507$$].x) * ($py$$2$$ - $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$[$i$$inline_507$$].y) /
          ($JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$[$j$$inline_506$$].y - $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$[$i$$inline_507$$].y) + $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$[$i$$inline_507$$].x && ($inside$$inline_505$$ = !$inside$$inline_505$$), $j$$inline_506$$ = $i$$inline_507$$
        }
        $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$ = $inside$$inline_505$$
      }else {
        $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$ = $JSCompiler_alias_FALSE$$
      }
    }
    $JSCompiler_inline_result$$9_points$$inline_504_shape$$inline_501$$ && $intersectedAnnotations$$.push($annotation$$10$$)
  });
  $goog$array$ARRAY_PROTOTYPE_$$.sort.call($intersectedAnnotations$$, function($a$$30$$, $b$$25$$) {
    return $annotorious$shape$getSize$$($a$$30$$.shapes[0]) - $annotorious$shape$getSize$$($b$$25$$.shapes[0])
  } || $goog$array$defaultCompare$$);
  return $intersectedAnnotations$$
};
function $JSCompiler_StaticMethods__draw$$($JSCompiler_StaticMethods__draw$self$$, $shape$$9$$, $highlight$$) {
  var $selector$$5$$ = $goog$array$find$$($JSCompiler_StaticMethods__draw$self$$.$_annotator$.$getAvailableSelectors$(), function($selector$$6$$) {
    return $selector$$6$$.getSupportedShapeType() == $shape$$9$$.type
  });
  $selector$$5$$ ? $selector$$5$$.drawShape($JSCompiler_StaticMethods__draw$self$$.$_g2d$, $shape$$9$$, $highlight$$) : console.log("WARNING unsupported shape type: " + $shape$$9$$.type)
}
function $JSCompiler_StaticMethods__redraw$$($JSCompiler_StaticMethods__redraw$self$$) {
  $JSCompiler_StaticMethods__redraw$self$$.$_g2d$.clearRect(0, 0, $JSCompiler_StaticMethods__redraw$self$$.$_canvas$.width, $JSCompiler_StaticMethods__redraw$self$$.$_canvas$.height);
  $goog$array$forEach$$($JSCompiler_StaticMethods__redraw$self$$.$_annotations$, function($annotation$$11$$) {
    $JSCompiler_StaticMethods__draw$$($JSCompiler_StaticMethods__redraw$self$$, $JSCompiler_StaticMethods__redraw$self$$.$_shapes$[$annotorious$shape$hashCode$$($annotation$$11$$.shapes[0])])
  });
  if($JSCompiler_StaticMethods__redraw$self$$.$_currentAnnotation$) {
    var $bbox_shape$$10$$ = $JSCompiler_StaticMethods__redraw$self$$.$_shapes$[$annotorious$shape$hashCode$$($JSCompiler_StaticMethods__redraw$self$$.$_currentAnnotation$.shapes[0])];
    $JSCompiler_StaticMethods__draw$$($JSCompiler_StaticMethods__redraw$self$$, $bbox_shape$$10$$, $JSCompiler_alias_TRUE$$);
    $bbox_shape$$10$$ = $annotorious$shape$getBoundingRect$$($bbox_shape$$10$$).geometry;
    $JSCompiler_StaticMethods__redraw$self$$.$_popup$.show($JSCompiler_StaticMethods__redraw$self$$.$_currentAnnotation$, new $annotorious$shape$geom$Point$$($bbox_shape$$10$$.x, $bbox_shape$$10$$.y + $bbox_shape$$10$$.height + 5))
  }
}
;$goog$userAgent$IE$$ && $goog$userAgent$isVersion$$(8);
function $goog$string$StringBuffer$$($opt_a1$$, $var_args$$69$$) {
  $opt_a1$$ != $JSCompiler_alias_NULL$$ && this.append.apply(this, arguments)
}
$JSCompiler_prototypeAlias$$ = $goog$string$StringBuffer$$.prototype;
$JSCompiler_prototypeAlias$$.$buffer_$ = "";
$JSCompiler_prototypeAlias$$.set = function $$JSCompiler_prototypeAlias$$$set$($s$$21$$) {
  this.$buffer_$ = "" + $s$$21$$
};
$JSCompiler_prototypeAlias$$.append = function $$JSCompiler_prototypeAlias$$$append$($a1$$, $opt_a2$$, $var_args$$70$$) {
  this.$buffer_$ += $a1$$;
  if($opt_a2$$ != $JSCompiler_alias_NULL$$) {
    for(var $i$$108$$ = 1;$i$$108$$ < arguments.length;$i$$108$$++) {
      this.$buffer_$ += arguments[$i$$108$$]
    }
  }
  return this
};
$JSCompiler_prototypeAlias$$.clear = function $$JSCompiler_prototypeAlias$$$clear$() {
  this.$buffer_$ = ""
};
$JSCompiler_prototypeAlias$$.toString = $JSCompiler_get$$("$buffer_$");
function $soy$$0$0escapeHtml$$($value$$75$$) {
  return"object" === typeof $value$$75$$ && $value$$75$$ && 0 === $value$$75$$.$contentKind$ ? $value$$75$$.content : String($value$$75$$).replace($soy$esc$$0$0MATCHER_FOR_ESCAPE_HTML_$$, $soy$esc$$0$0REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_$$)
}
var $soy$esc$$0$0ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_$$ = {"\x00":"&#0;", '"':"&quot;", "&":"&amp;", "'":"&#39;", "<":"&lt;", ">":"&gt;", "\t":"&#9;", "\n":"&#10;", "\x0B":"&#11;", "\f":"&#12;", "\r":"&#13;", " ":"&#32;", "-":"&#45;", "/":"&#47;", "=":"&#61;", "`":"&#96;", "\u0085":"&#133;", "\u00a0":"&#160;", "\u2028":"&#8232;", "\u2029":"&#8233;"};
function $soy$esc$$0$0REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_$$($ch$$6$$) {
  return $soy$esc$$0$0ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_$$[$ch$$6$$]
}
var $soy$esc$$0$0MATCHER_FOR_ESCAPE_HTML_$$ = /[\x00\x22\x26\x27\x3c\x3e]/g;
function $annotorious$templates$image$canvas$$($opt_data$$3$$) {
  return'<canvas class="annotorious-item annotorious-opacity-fade" style="position:absolute; top:0px; left:0px; width:' + $soy$$0$0escapeHtml$$($opt_data$$3$$.width) + "px; height:" + $soy$$0$0escapeHtml$$($opt_data$$3$$.height) + 'px; z-index:0" width="' + $soy$$0$0escapeHtml$$($opt_data$$3$$.width) + '" height="' + $soy$$0$0escapeHtml$$($opt_data$$3$$.height) + '"></canvas>'
}
function $annotorious$templates$image$hint$$($opt_data$$4$$) {
  return'<div class="annotorious-hint" style="white-space:nowrap; position:absolute; top:0px; left:0px; pointer-events:none;"><div class="annotorious-hint-msg annotorious-opacity-fade">' + $soy$$0$0escapeHtml$$($opt_data$$4$$.$msg$) + '</div><div class="annotorious-hint-icon" style="pointer-events:auto"></div></div>'
}
;function $annotorious$viewer$Popup$$($annotator$$23$$) {
  this.element = $goog$soy$renderAsElement$$($annotorious$templates$popup$$);
  this.$_annotator$ = $annotator$$23$$;
  this.$_text$ = $query$$inline_152$$(".annotorious-popup-text", this.element)[0];
  this.$_buttons$ = $query$$inline_152$$(".annotorious-popup-buttons", this.element)[0];
  this.$_cancelHide$ = $JSCompiler_alias_FALSE$$;
  this.$_extraFields$ = [];
  var $btnEdit$$ = $query$$inline_152$$(".annotorious-popup-button-edit", this.$_buttons$)[0], $btnDelete$$ = $query$$inline_152$$(".annotorious-popup-button-delete", this.$_buttons$)[0], $self$$11$$ = this;
  $goog$events$listen$$($btnEdit$$, "mouseover", function() {
    $goog$dom$classes$add$$($btnEdit$$, "annotorious-popup-button-active")
  });
  $goog$events$listen$$($btnEdit$$, "mouseout", function() {
    $goog$dom$classes$remove$$($btnEdit$$, "annotorious-popup-button-active")
  });
  $goog$events$listen$$($btnEdit$$, "click", function() {
    $goog$style$setOpacity$$($self$$11$$.element, 0);
    $goog$style$setStyle$$($self$$11$$.element, "pointer-events", "none");
    $annotator$$23$$.$editAnnotation$($self$$11$$.$_currentAnnotation$)
  });
  $goog$events$listen$$($btnDelete$$, "mouseover", function() {
    $goog$dom$classes$add$$($btnDelete$$, "annotorious-popup-button-active")
  });
  $goog$events$listen$$($btnDelete$$, "mouseout", function() {
    $goog$dom$classes$remove$$($btnDelete$$, "annotorious-popup-button-active")
  });
  $goog$events$listen$$($btnDelete$$, "click", function() {
    $annotator$$23$$.fireEvent("beforeAnnotationRemoved", $self$$11$$.$_currentAnnotation$) || ($goog$style$setOpacity$$($self$$11$$.element, 0), $goog$style$setStyle$$($self$$11$$.element, "pointer-events", "none"), $annotator$$23$$.$removeAnnotation$($self$$11$$.$_currentAnnotation$), $annotator$$23$$.fireEvent("onAnnotationRemoved", $self$$11$$.$_currentAnnotation$))
  });
  $goog$events$listen$$(this.element, "mouseover", function() {
    window.clearTimeout($self$$11$$.$_buttonHideTimer$);
    0.9 > ($self$$11$$.$_buttons$.style[$goog$string$toCamelCase$$("opacity")] || "") && $goog$style$setOpacity$$($self$$11$$.$_buttons$, 0.9);
    $JSCompiler_StaticMethods_clearHideTimer$$($self$$11$$)
  });
  $goog$events$listen$$(this.element, "mouseout", function() {
    $goog$style$setOpacity$$($self$$11$$.$_buttons$, 0);
    $JSCompiler_StaticMethods_startHideTimer$$($self$$11$$)
  });
  $annotator$$23$$.$addHandler$("onMouseOutOfItem", function() {
    $JSCompiler_StaticMethods_startHideTimer$$($self$$11$$)
  });
  $goog$style$setOpacity$$(this.$_buttons$, 0);
  $goog$style$setOpacity$$(this.element, 0);
  $goog$style$setStyle$$(this.element, "pointer-events", "none");
  $annotator$$23$$.element.appendChild(this.element)
}
$annotorious$viewer$Popup$$.prototype.$addField$ = function $$annotorious$viewer$Popup$$$$$addField$$($field$$) {
  var $fieldEl$$ = $goog$dom$createDom$$("div", "annotorious-popup-field");
  $goog$isString$$($field$$) ? $fieldEl$$.innerHTML = $field$$ : $goog$isFunction$$($field$$) ? this.$_extraFields$.push({$el$:$fieldEl$$, $fn$:$field$$}) : $goog$dom$isElement$$($field$$) && $fieldEl$$.appendChild($field$$);
  this.element.appendChild($fieldEl$$)
};
function $JSCompiler_StaticMethods_startHideTimer$$($JSCompiler_StaticMethods_startHideTimer$self$$) {
  $JSCompiler_StaticMethods_startHideTimer$self$$.$_cancelHide$ = $JSCompiler_alias_FALSE$$;
  $JSCompiler_StaticMethods_startHideTimer$self$$.$_popupHideTimer$ || ($JSCompiler_StaticMethods_startHideTimer$self$$.$_popupHideTimer$ = window.setTimeout(function() {
    $JSCompiler_StaticMethods_startHideTimer$self$$.$_annotator$.fireEvent("beforePopupHide", $JSCompiler_StaticMethods_startHideTimer$self$$);
    $JSCompiler_StaticMethods_startHideTimer$self$$.$_cancelHide$ || ($goog$style$setOpacity$$($JSCompiler_StaticMethods_startHideTimer$self$$.element, 0), $goog$style$setStyle$$($JSCompiler_StaticMethods_startHideTimer$self$$.element, "pointer-events", "none"), $goog$style$setOpacity$$($JSCompiler_StaticMethods_startHideTimer$self$$.$_buttons$, 0.9), delete $JSCompiler_StaticMethods_startHideTimer$self$$.$_popupHideTimer$)
  }, 300))
}
function $JSCompiler_StaticMethods_clearHideTimer$$($JSCompiler_StaticMethods_clearHideTimer$self$$) {
  $JSCompiler_StaticMethods_clearHideTimer$self$$.$_cancelHide$ = $JSCompiler_alias_TRUE$$;
  $JSCompiler_StaticMethods_clearHideTimer$self$$.$_popupHideTimer$ && (window.clearTimeout($JSCompiler_StaticMethods_clearHideTimer$self$$.$_popupHideTimer$), delete $JSCompiler_StaticMethods_clearHideTimer$self$$.$_popupHideTimer$)
}
$annotorious$viewer$Popup$$.prototype.show = function $$annotorious$viewer$Popup$$$$show$($annotation$$12$$, $xy$$1$$) {
  $JSCompiler_StaticMethods_clearHideTimer$$(this);
  $xy$$1$$ && this.$setPosition$($xy$$1$$);
  $annotation$$12$$ && $JSCompiler_StaticMethods_setAnnotation$$(this, $annotation$$12$$);
  this.$_buttonHideTimer$ && window.clearTimeout(this.$_buttonHideTimer$);
  $goog$style$setOpacity$$(this.$_buttons$, 0.9);
  var $self$$13$$ = this;
  this.$_buttonHideTimer$ = window.setTimeout(function() {
    $goog$style$setOpacity$$($self$$13$$.$_buttons$, 0)
  }, 1E3);
  $goog$style$setOpacity$$(this.element, 0.9);
  $goog$style$setStyle$$(this.element, "pointer-events", "auto")
};
$annotorious$viewer$Popup$$.prototype.$setPosition$ = function $$annotorious$viewer$Popup$$$$$setPosition$$($xy$$2$$) {
  $goog$style$setPosition$$(this.element, new $goog$math$Coordinate$$($xy$$2$$.x, $xy$$2$$.y))
};
function $JSCompiler_StaticMethods_setAnnotation$$($JSCompiler_StaticMethods_setAnnotation$self$$, $annotation$$13$$) {
  $JSCompiler_StaticMethods_setAnnotation$self$$.$_currentAnnotation$ = $annotation$$13$$;
  $JSCompiler_StaticMethods_setAnnotation$self$$.$_text$.innerHTML = $annotation$$13$$.text ? $annotation$$13$$.text.replace(/\n/g, "<br/>") : '<span class="annotorious-popup-empty">No comment</span>';
  "editable" in $annotation$$13$$ && $annotation$$13$$.editable == $JSCompiler_alias_FALSE$$ ? $goog$style$showElement$$($JSCompiler_StaticMethods_setAnnotation$self$$.$_buttons$, $JSCompiler_alias_FALSE$$) : $goog$style$showElement$$($JSCompiler_StaticMethods_setAnnotation$self$$.$_buttons$, $JSCompiler_alias_TRUE$$);
  $goog$array$forEach$$($JSCompiler_StaticMethods_setAnnotation$self$$.$_extraFields$, function($field$$1$$) {
    var $f$$43$$ = $field$$1$$.$fn$($annotation$$13$$);
    $goog$isString$$($f$$43$$) ? $field$$1$$.$el$.innerHTML = $f$$43$$ : $goog$dom$isElement$$($f$$43$$) && ($goog$dom$removeChildren$$($field$$1$$.$el$), $field$$1$$.$el$.appendChild($f$$43$$))
  })
}
$annotorious$viewer$Popup$$.prototype.addField = $annotorious$viewer$Popup$$.prototype.$addField$;
function $goog$events$KeyCodes$firesKeyPressEvent$$($keyCode$$, $opt_heldKeyCode$$, $opt_shiftKey$$, $opt_ctrlKey$$, $opt_altKey$$) {
  if(!$goog$userAgent$IE$$ && (!$goog$userAgent$WEBKIT$$ || !$goog$userAgent$isVersion$$("525"))) {
    return $JSCompiler_alias_TRUE$$
  }
  if($goog$userAgent$detectedMac_$$ && $opt_altKey$$) {
    return $goog$events$KeyCodes$isCharacterKey$$($keyCode$$)
  }
  if($opt_altKey$$ && !$opt_ctrlKey$$ || !$opt_shiftKey$$ && (17 == $opt_heldKeyCode$$ || 18 == $opt_heldKeyCode$$) || $goog$userAgent$IE$$ && $opt_ctrlKey$$ && $opt_heldKeyCode$$ == $keyCode$$) {
    return $JSCompiler_alias_FALSE$$
  }
  switch($keyCode$$) {
    case 13:
      return!($goog$userAgent$IE$$ && $goog$userAgent$isDocumentMode$$(9));
    case 27:
      return!$goog$userAgent$WEBKIT$$
  }
  return $goog$events$KeyCodes$isCharacterKey$$($keyCode$$)
}
function $goog$events$KeyCodes$isCharacterKey$$($keyCode$$1$$) {
  if(48 <= $keyCode$$1$$ && 57 >= $keyCode$$1$$ || 96 <= $keyCode$$1$$ && 106 >= $keyCode$$1$$ || 65 <= $keyCode$$1$$ && 90 >= $keyCode$$1$$ || $goog$userAgent$WEBKIT$$ && 0 == $keyCode$$1$$) {
    return $JSCompiler_alias_TRUE$$
  }
  switch($keyCode$$1$$) {
    case 32:
    ;
    case 63:
    ;
    case 107:
    ;
    case 109:
    ;
    case 110:
    ;
    case 111:
    ;
    case 186:
    ;
    case 59:
    ;
    case 189:
    ;
    case 187:
    ;
    case 61:
    ;
    case 188:
    ;
    case 190:
    ;
    case 191:
    ;
    case 192:
    ;
    case 222:
    ;
    case 219:
    ;
    case 220:
    ;
    case 221:
      return $JSCompiler_alias_TRUE$$;
    default:
      return $JSCompiler_alias_FALSE$$
  }
}
function $goog$events$KeyCodes$normalizeGeckoKeyCode$$($keyCode$$2$$) {
  switch($keyCode$$2$$) {
    case 61:
      return 187;
    case 59:
      return 186;
    case 224:
      return 91;
    case 0:
      return 224;
    default:
      return $keyCode$$2$$
  }
}
;function $goog$events$KeyHandler$$($opt_element$$11$$, $opt_capture$$6$$) {
  $goog$Disposable$$.call(this);
  $opt_element$$11$$ && $JSCompiler_StaticMethods_attach$$(this, $opt_element$$11$$, $opt_capture$$6$$)
}
$goog$inherits$$($goog$events$KeyHandler$$, $goog$events$EventTarget$$);
$JSCompiler_prototypeAlias$$ = $goog$events$KeyHandler$$.prototype;
$JSCompiler_prototypeAlias$$.$element_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$keyPressKey_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$keyDownKey_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$keyUpKey_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$lastKey_$ = -1;
$JSCompiler_prototypeAlias$$.$keyCode_$ = -1;
$JSCompiler_prototypeAlias$$.$altKey_$ = $JSCompiler_alias_FALSE$$;
var $goog$events$KeyHandler$safariKey_$$ = {3:13, 12:144, 63232:38, 63233:40, 63234:37, 63235:39, 63236:112, 63237:113, 63238:114, 63239:115, 63240:116, 63241:117, 63242:118, 63243:119, 63244:120, 63245:121, 63246:122, 63247:123, 63248:44, 63272:46, 63273:36, 63275:35, 63276:33, 63277:34, 63289:144, 63302:45}, $goog$events$KeyHandler$keyIdentifier_$$ = {Up:38, Down:40, Left:37, Right:39, Enter:13, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, "U+007F":46,
Home:36, End:35, PageUp:33, PageDown:34, Insert:45}, $goog$events$KeyHandler$USES_KEYDOWN_$$ = $goog$userAgent$IE$$ || $goog$userAgent$WEBKIT$$ && $goog$userAgent$isVersion$$("525"), $goog$events$KeyHandler$SAVE_ALT_FOR_KEYPRESS_$$ = $goog$userAgent$detectedMac_$$ && $goog$userAgent$GECKO$$;
$JSCompiler_prototypeAlias$$ = $goog$events$KeyHandler$$.prototype;
$JSCompiler_prototypeAlias$$.$handleKeyDown_$ = function $$JSCompiler_prototypeAlias$$$$handleKeyDown_$$($e$$36$$) {
  if($goog$userAgent$WEBKIT$$ && (17 == this.$lastKey_$ && !$e$$36$$.ctrlKey || 18 == this.$lastKey_$ && !$e$$36$$.altKey)) {
    this.$keyCode_$ = this.$lastKey_$ = -1
  }
  $goog$events$KeyHandler$USES_KEYDOWN_$$ && !$goog$events$KeyCodes$firesKeyPressEvent$$($e$$36$$.keyCode, this.$lastKey_$, $e$$36$$.shiftKey, $e$$36$$.ctrlKey, $e$$36$$.altKey) ? this.handleEvent($e$$36$$) : (this.$keyCode_$ = $goog$userAgent$GECKO$$ ? $goog$events$KeyCodes$normalizeGeckoKeyCode$$($e$$36$$.keyCode) : $e$$36$$.keyCode, $goog$events$KeyHandler$SAVE_ALT_FOR_KEYPRESS_$$ && (this.$altKey_$ = $e$$36$$.altKey))
};
$JSCompiler_prototypeAlias$$.$handleKeyup_$ = function $$JSCompiler_prototypeAlias$$$$handleKeyup_$$($e$$37$$) {
  this.$keyCode_$ = this.$lastKey_$ = -1;
  this.$altKey_$ = $e$$37$$.altKey
};
$JSCompiler_prototypeAlias$$.handleEvent = function $$JSCompiler_prototypeAlias$$$handleEvent$($e$$38_repeat$$) {
  var $be$$2_event$$14$$ = $e$$38_repeat$$.$event_$, $keyCode$$3$$, $charCode$$4$$, $altKey$$2$$ = $be$$2_event$$14$$.altKey;
  $goog$userAgent$IE$$ && "keypress" == $e$$38_repeat$$.type ? ($keyCode$$3$$ = this.$keyCode_$, $charCode$$4$$ = 13 != $keyCode$$3$$ && 27 != $keyCode$$3$$ ? $be$$2_event$$14$$.keyCode : 0) : $goog$userAgent$WEBKIT$$ && "keypress" == $e$$38_repeat$$.type ? ($keyCode$$3$$ = this.$keyCode_$, $charCode$$4$$ = 0 <= $be$$2_event$$14$$.charCode && 63232 > $be$$2_event$$14$$.charCode && $goog$events$KeyCodes$isCharacterKey$$($keyCode$$3$$) ? $be$$2_event$$14$$.charCode : 0) : $goog$userAgent$OPERA$$ ?
  ($keyCode$$3$$ = this.$keyCode_$, $charCode$$4$$ = $goog$events$KeyCodes$isCharacterKey$$($keyCode$$3$$) ? $be$$2_event$$14$$.keyCode : 0) : ($keyCode$$3$$ = $be$$2_event$$14$$.keyCode || this.$keyCode_$, $charCode$$4$$ = $be$$2_event$$14$$.charCode || 0, $goog$events$KeyHandler$SAVE_ALT_FOR_KEYPRESS_$$ && ($altKey$$2$$ = this.$altKey_$), $goog$userAgent$detectedMac_$$ && (63 == $charCode$$4$$ && 224 == $keyCode$$3$$) && ($keyCode$$3$$ = 191));
  var $key$$67$$ = $keyCode$$3$$, $keyIdentifier$$ = $be$$2_event$$14$$.keyIdentifier;
  $keyCode$$3$$ ? 63232 <= $keyCode$$3$$ && $keyCode$$3$$ in $goog$events$KeyHandler$safariKey_$$ ? $key$$67$$ = $goog$events$KeyHandler$safariKey_$$[$keyCode$$3$$] : 25 == $keyCode$$3$$ && $e$$38_repeat$$.shiftKey && ($key$$67$$ = 9) : $keyIdentifier$$ && $keyIdentifier$$ in $goog$events$KeyHandler$keyIdentifier_$$ && ($key$$67$$ = $goog$events$KeyHandler$keyIdentifier_$$[$keyIdentifier$$]);
  $e$$38_repeat$$ = $key$$67$$ == this.$lastKey_$;
  this.$lastKey_$ = $key$$67$$;
  $be$$2_event$$14$$ = new $goog$events$KeyEvent$$($key$$67$$, $charCode$$4$$, $e$$38_repeat$$, $be$$2_event$$14$$);
  $be$$2_event$$14$$.altKey = $altKey$$2$$;
  this.dispatchEvent($be$$2_event$$14$$)
};
$JSCompiler_prototypeAlias$$.$getElement$ = $JSCompiler_get$$("$element_$");
function $JSCompiler_StaticMethods_attach$$($JSCompiler_StaticMethods_attach$self$$, $element$$72$$, $opt_capture$$7$$) {
  $JSCompiler_StaticMethods_attach$self$$.$keyUpKey_$ && $JSCompiler_StaticMethods_attach$self$$.detach();
  $JSCompiler_StaticMethods_attach$self$$.$element_$ = $element$$72$$;
  $JSCompiler_StaticMethods_attach$self$$.$keyPressKey_$ = $goog$events$listen$$($JSCompiler_StaticMethods_attach$self$$.$element_$, "keypress", $JSCompiler_StaticMethods_attach$self$$, $opt_capture$$7$$);
  $JSCompiler_StaticMethods_attach$self$$.$keyDownKey_$ = $goog$events$listen$$($JSCompiler_StaticMethods_attach$self$$.$element_$, "keydown", $JSCompiler_StaticMethods_attach$self$$.$handleKeyDown_$, $opt_capture$$7$$, $JSCompiler_StaticMethods_attach$self$$);
  $JSCompiler_StaticMethods_attach$self$$.$keyUpKey_$ = $goog$events$listen$$($JSCompiler_StaticMethods_attach$self$$.$element_$, "keyup", $JSCompiler_StaticMethods_attach$self$$.$handleKeyup_$, $opt_capture$$7$$, $JSCompiler_StaticMethods_attach$self$$)
}
$JSCompiler_prototypeAlias$$.detach = function $$JSCompiler_prototypeAlias$$$detach$() {
  this.$keyPressKey_$ && ($goog$events$unlistenByKey$$(this.$keyPressKey_$), $goog$events$unlistenByKey$$(this.$keyDownKey_$), $goog$events$unlistenByKey$$(this.$keyUpKey_$), this.$keyUpKey_$ = this.$keyDownKey_$ = this.$keyPressKey_$ = $JSCompiler_alias_NULL$$);
  this.$element_$ = $JSCompiler_alias_NULL$$;
  this.$keyCode_$ = this.$lastKey_$ = -1
};
function $goog$events$KeyEvent$$($keyCode$$4$$, $charCode$$5$$, $repeat$$1$$, $browserEvent$$1$$) {
  $browserEvent$$1$$ && this.init($browserEvent$$1$$, $JSCompiler_alias_VOID$$);
  this.type = "key";
  this.keyCode = $keyCode$$4$$;
  this.charCode = $charCode$$5$$;
  this.repeat = $repeat$$1$$
}
$goog$inherits$$($goog$events$KeyEvent$$, $goog$events$BrowserEvent$$);
function $goog$ui$IdGenerator$$() {
}
$goog$addSingletonGetter$$($goog$ui$IdGenerator$$);
$goog$ui$IdGenerator$$.prototype.$nextId_$ = 0;
$goog$ui$IdGenerator$$.$getInstance$();
function $goog$ui$Component$$($opt_domHelper$$2$$) {
  $goog$Disposable$$.call(this);
  this.$dom_$ = $opt_domHelper$$2$$ || $goog$dom$getDomHelper$$();
  this.$rightToLeft_$ = $goog$ui$Component$defaultRightToLeft_$$
}
$goog$inherits$$($goog$ui$Component$$, $goog$events$EventTarget$$);
$goog$ui$Component$$.prototype.$idGenerator_$ = $goog$ui$IdGenerator$$.$getInstance$();
var $goog$ui$Component$defaultRightToLeft_$$ = $JSCompiler_alias_NULL$$;
function $goog$ui$Component$getStateTransitionEvent$$($state$$, $isEntering$$) {
  switch($state$$) {
    case 1:
      return $isEntering$$ ? "disable" : "enable";
    case 2:
      return $isEntering$$ ? "highlight" : "unhighlight";
    case 4:
      return $isEntering$$ ? "activate" : "deactivate";
    case 8:
      return $isEntering$$ ? "select" : "unselect";
    case 16:
      return $isEntering$$ ? "check" : "uncheck";
    case 32:
      return $isEntering$$ ? "focus" : "blur";
    case 64:
      return $isEntering$$ ? "open" : "close"
  }
  $JSCompiler_alias_THROW$$(Error("Invalid component state"))
}
$JSCompiler_prototypeAlias$$ = $goog$ui$Component$$.prototype;
$JSCompiler_prototypeAlias$$.$id_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$inDocument_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$element_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$rightToLeft_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$parent_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$children_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$childIndex_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$wasDecorated_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$getElement$ = $JSCompiler_get$$("$element_$");
$JSCompiler_prototypeAlias$$.$getHandler$ = function $$JSCompiler_prototypeAlias$$$$getHandler$$() {
  return this.$googUiComponentHandler_$ || (this.$googUiComponentHandler_$ = new $goog$events$EventHandler$$(this))
};
$JSCompiler_prototypeAlias$$.$setParentEventTarget$ = function $$JSCompiler_prototypeAlias$$$$setParentEventTarget$$($parent$$23$$) {
  this.$parent_$ && this.$parent_$ != $parent$$23$$ && $JSCompiler_alias_THROW$$(Error("Method not supported"));
  $goog$ui$Component$$.$superClass_$.$setParentEventTarget$.call(this, $parent$$23$$)
};
$JSCompiler_prototypeAlias$$.$getDomHelper$ = $JSCompiler_get$$("$dom_$");
$JSCompiler_prototypeAlias$$.$decorate$ = function $$JSCompiler_prototypeAlias$$$$decorate$$($element$$74$$) {
  this.$inDocument_$ && $JSCompiler_alias_THROW$$(Error("Component already rendered"));
  if($element$$74$$ && this.$canDecorate$($element$$74$$)) {
    this.$wasDecorated_$ = $JSCompiler_alias_TRUE$$;
    if(!this.$dom_$ || this.$dom_$.$document_$ != $goog$dom$getOwnerDocument$$($element$$74$$)) {
      this.$dom_$ = $goog$dom$getDomHelper$$($element$$74$$)
    }
    this.$decorateInternal$($element$$74$$);
    this.$enterDocument$()
  }else {
    $JSCompiler_alias_THROW$$(Error("Invalid element to decorate"))
  }
};
$JSCompiler_prototypeAlias$$.$canDecorate$ = $JSCompiler_returnArg$$($JSCompiler_alias_TRUE$$);
$JSCompiler_prototypeAlias$$.$decorateInternal$ = function $$JSCompiler_prototypeAlias$$$$decorateInternal$$($element$$76$$) {
  this.$element_$ = $element$$76$$
};
$JSCompiler_prototypeAlias$$.$enterDocument$ = function $$JSCompiler_prototypeAlias$$$$enterDocument$$() {
  function $f$$inline_530$$($child$$8$$) {
    !$child$$8$$.$inDocument_$ && $child$$8$$.$getElement$() && $child$$8$$.$enterDocument$()
  }
  this.$inDocument_$ = $JSCompiler_alias_TRUE$$;
  this.$children_$ && $goog$array$forEach$$(this.$children_$, $f$$inline_530$$, $JSCompiler_alias_VOID$$)
};
$JSCompiler_prototypeAlias$$.$exitDocument$ = function $$JSCompiler_prototypeAlias$$$$exitDocument$$() {
  function $f$$inline_534$$($child$$9$$) {
    $child$$9$$.$inDocument_$ && $child$$9$$.$exitDocument$()
  }
  this.$children_$ && $goog$array$forEach$$(this.$children_$, $f$$inline_534$$, $JSCompiler_alias_VOID$$);
  this.$googUiComponentHandler_$ && this.$googUiComponentHandler_$.$removeAll$();
  this.$inDocument_$ = $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.$getContentElement$ = $JSCompiler_get$$("$element_$");
$JSCompiler_prototypeAlias$$.$setRightToLeft$ = function $$JSCompiler_prototypeAlias$$$$setRightToLeft$$($rightToLeft$$1$$) {
  this.$inDocument_$ && $JSCompiler_alias_THROW$$(Error("Component already rendered"));
  this.$rightToLeft_$ = $rightToLeft$$1$$
};
$JSCompiler_prototypeAlias$$.removeChild = function $$JSCompiler_prototypeAlias$$$removeChild$($child$$15$$, $opt_unrender$$) {
  if($child$$15$$) {
    var $JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$ = $goog$isString$$($child$$15$$) ? $child$$15$$ : $child$$15$$.$id_$ || ($child$$15$$.$id_$ = ":" + ($child$$15$$.$idGenerator_$.$nextId_$++).toString(36)), $JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$;
    this.$childIndex_$ && $JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$ ? ($JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$ = this.$childIndex_$, $JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$ = ($JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$ in $JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$ ? $JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$[$JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$] : $JSCompiler_alias_VOID$$) ||
    $JSCompiler_alias_NULL$$) : $JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$ = $JSCompiler_alias_NULL$$;
    $child$$15$$ = $JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$;
    $JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$ && $child$$15$$ && ($JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$ = this.$childIndex_$, $JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$ in $JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$ && delete $JSCompiler_temp$$inline_858_obj$$inline_859_obj$$inline_862$$[$JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$], $goog$array$remove$$(this.$children_$, $child$$15$$), $opt_unrender$$ &&
    ($child$$15$$.$exitDocument$(), $child$$15$$.$element_$ && $goog$dom$removeNode$$($child$$15$$.$element_$)), $JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$ = $child$$15$$, $JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Unable to set parent component")), $JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$.$parent_$ = $JSCompiler_alias_NULL$$, $goog$ui$Component$$.$superClass_$.$setParentEventTarget$.call($JSCompiler_StaticMethods_setParent$self$$inline_541_id$$6$$,
    $JSCompiler_alias_NULL$$))
  }
  $child$$15$$ || $JSCompiler_alias_THROW$$(Error("Child is not in parent component"));
  return $child$$15$$
};
function $goog$ui$ControlRenderer$$() {
}
var $goog$ui$ControlRenderer$ARIA_STATE_MAP_$$;
$goog$addSingletonGetter$$($goog$ui$ControlRenderer$$);
$JSCompiler_prototypeAlias$$ = $goog$ui$ControlRenderer$$.prototype;
$JSCompiler_prototypeAlias$$.$getContentElement$ = function $$JSCompiler_prototypeAlias$$$$getContentElement$$($element$$84$$) {
  return $element$$84$$
};
$JSCompiler_prototypeAlias$$.$enableClassName$ = function $$JSCompiler_prototypeAlias$$$$enableClassName$$($control$$1_element$$85$$, $className$$16$$, $enable$$1$$) {
  if($control$$1_element$$85$$ = $control$$1_element$$85$$.$getElement$ ? $control$$1_element$$85$$.$getElement$() : $control$$1_element$$85$$) {
    if($goog$userAgent$IE$$ && !$goog$userAgent$isVersion$$("7")) {
      var $combinedClasses$$ = $JSCompiler_StaticMethods_getAppliedCombinedClassNames_$$($goog$dom$classes$get$$($control$$1_element$$85$$), $className$$16$$);
      $combinedClasses$$.push($className$$16$$);
      $goog$partial$$($enable$$1$$ ? $goog$dom$classes$add$$ : $goog$dom$classes$remove$$, $control$$1_element$$85$$).apply($JSCompiler_alias_NULL$$, $combinedClasses$$)
    }else {
      $enable$$1$$ ? $goog$dom$classes$add$$($control$$1_element$$85$$, $className$$16$$) : $goog$dom$classes$remove$$($control$$1_element$$85$$, $className$$16$$)
    }
  }
};
$JSCompiler_prototypeAlias$$.$canDecorate$ = $JSCompiler_returnArg$$($JSCompiler_alias_TRUE$$);
$JSCompiler_prototypeAlias$$.$decorate$ = function $$JSCompiler_prototypeAlias$$$$decorate$$($control$$3$$, $element$$87$$) {
  if($element$$87$$.id) {
    var $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$ = $element$$87$$.id;
    if($control$$3$$.$parent_$ && $control$$3$$.$parent_$.$childIndex_$) {
      var $classNames$$1_obj$$inline_865_obj$$inline_868$$ = $control$$3$$.$parent_$.$childIndex_$, $extraClassNames_key$$inline_866$$ = $control$$3$$.$id_$;
      $extraClassNames_key$$inline_866$$ in $classNames$$1_obj$$inline_865_obj$$inline_868$$ && delete $classNames$$1_obj$$inline_865_obj$$inline_868$$[$extraClassNames_key$$inline_866$$];
      $classNames$$1_obj$$inline_865_obj$$inline_868$$ = $control$$3$$.$parent_$.$childIndex_$;
      $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$ in $classNames$$1_obj$$inline_865_obj$$inline_868$$ && $JSCompiler_alias_THROW$$(Error('The object already contains the key "' + $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$ + '"'));
      $classNames$$1_obj$$inline_865_obj$$inline_868$$[$content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$] = $control$$3$$
    }
    $control$$3$$.$id_$ = $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$
  }
  ($content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$ = this.$getContentElement$($element$$87$$)) && $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$.firstChild ? ($content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$ = $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$.firstChild.nextSibling ? $goog$array$toArray$$($content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$.childNodes) : $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$.firstChild,
  $control$$3$$.$content_$ = $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$) : $control$$3$$.$content_$ = $JSCompiler_alias_NULL$$;
  var $state$$2$$ = 0, $rendererClassName$$ = this.$getCssClass$(), $structuralClassName$$ = this.$getCssClass$(), $hasRendererClassName$$ = $JSCompiler_alias_FALSE$$, $hasStructuralClassName$$ = $JSCompiler_alias_FALSE$$, $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$ = $JSCompiler_alias_FALSE$$, $classNames$$1_obj$$inline_865_obj$$inline_868$$ = $goog$dom$classes$get$$($element$$87$$);
  $goog$array$forEach$$($classNames$$1_obj$$inline_865_obj$$inline_868$$, function($className$$18_state$$inline_559$$) {
    if(!$hasRendererClassName$$ && $className$$18_state$$inline_559$$ == $rendererClassName$$) {
      $hasRendererClassName$$ = $JSCompiler_alias_TRUE$$, $structuralClassName$$ == $rendererClassName$$ && ($hasStructuralClassName$$ = $JSCompiler_alias_TRUE$$)
    }else {
      if(!$hasStructuralClassName$$ && $className$$18_state$$inline_559$$ == $structuralClassName$$) {
        $hasStructuralClassName$$ = $JSCompiler_alias_TRUE$$
      }else {
        var $JSCompiler_temp_const$$29$$ = $state$$2$$;
        if(!this.$stateByClass_$) {
          this.$classByState_$ || $JSCompiler_StaticMethods_createClassByStateMap_$$(this);
          var $obj$$inline_905$$ = this.$classByState_$, $transposed$$inline_906$$ = {}, $key$$inline_907$$;
          for($key$$inline_907$$ in $obj$$inline_905$$) {
            $transposed$$inline_906$$[$obj$$inline_905$$[$key$$inline_907$$]] = $key$$inline_907$$
          }
          this.$stateByClass_$ = $transposed$$inline_906$$
        }
        $className$$18_state$$inline_559$$ = parseInt(this.$stateByClass_$[$className$$18_state$$inline_559$$], 10);
        $state$$2$$ = $JSCompiler_temp_const$$29$$ | (isNaN($className$$18_state$$inline_559$$) ? 0 : $className$$18_state$$inline_559$$)
      }
    }
  }, this);
  $control$$3$$.$state_$ = $state$$2$$;
  $hasRendererClassName$$ || ($classNames$$1_obj$$inline_865_obj$$inline_868$$.push($rendererClassName$$), $structuralClassName$$ == $rendererClassName$$ && ($hasStructuralClassName$$ = $JSCompiler_alias_TRUE$$));
  $hasStructuralClassName$$ || $classNames$$1_obj$$inline_865_obj$$inline_868$$.push($structuralClassName$$);
  ($extraClassNames_key$$inline_866$$ = $control$$3$$.$extraClassNames_$) && $classNames$$1_obj$$inline_865_obj$$inline_868$$.push.apply($classNames$$1_obj$$inline_865_obj$$inline_868$$, $extraClassNames_key$$inline_866$$);
  if($goog$userAgent$IE$$ && !$goog$userAgent$isVersion$$("7")) {
    var $combinedClasses$$1$$ = $JSCompiler_StaticMethods_getAppliedCombinedClassNames_$$($classNames$$1_obj$$inline_865_obj$$inline_868$$);
    0 < $combinedClasses$$1$$.length && ($classNames$$1_obj$$inline_865_obj$$inline_868$$.push.apply($classNames$$1_obj$$inline_865_obj$$inline_868$$, $combinedClasses$$1$$), $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$ = $JSCompiler_alias_TRUE$$)
  }
  if(!$hasRendererClassName$$ || !$hasStructuralClassName$$ || $extraClassNames_key$$inline_866$$ || $content$$inline_552_contentElem_hasCombinedClassName_id$$inline_549$$) {
    $element$$87$$.className = $classNames$$1_obj$$inline_865_obj$$inline_868$$.join(" ")
  }
  $control$$3$$.isEnabled() || this.$updateAriaState$($element$$87$$, 1, $JSCompiler_alias_TRUE$$);
  $control$$3$$.$state_$ & 8 && this.$updateAriaState$($element$$87$$, 8, $JSCompiler_alias_TRUE$$);
  $control$$3$$.$supportedStates_$ & 16 && this.$updateAriaState$($element$$87$$, 16, !!($control$$3$$.$state_$ & 16));
  $control$$3$$.$supportedStates_$ & 64 && this.$updateAriaState$($element$$87$$, 64, !!($control$$3$$.$state_$ & 64));
  return $element$$87$$
};
$JSCompiler_prototypeAlias$$.$setAllowTextSelection$ = function $$JSCompiler_prototypeAlias$$$$setAllowTextSelection$$($element$$90$$, $allow$$) {
  var $unselectable$$inline_572_value$$inline_575$$ = !$allow$$, $descendants$$inline_574$$ = $goog$userAgent$IE$$ || $goog$userAgent$OPERA$$ ? $element$$90$$.getElementsByTagName("*") : $JSCompiler_alias_NULL$$;
  if($goog$style$unselectableStyle_$$) {
    if($unselectable$$inline_572_value$$inline_575$$ = $unselectable$$inline_572_value$$inline_575$$ ? "none" : "", $element$$90$$.style[$goog$style$unselectableStyle_$$] = $unselectable$$inline_572_value$$inline_575$$, $descendants$$inline_574$$) {
      for(var $i$$inline_576$$ = 0, $descendant$$inline_577$$;$descendant$$inline_577$$ = $descendants$$inline_574$$[$i$$inline_576$$];$i$$inline_576$$++) {
        $descendant$$inline_577$$.style[$goog$style$unselectableStyle_$$] = $unselectable$$inline_572_value$$inline_575$$
      }
    }
  }else {
    if($goog$userAgent$IE$$ || $goog$userAgent$OPERA$$) {
      if($unselectable$$inline_572_value$$inline_575$$ = $unselectable$$inline_572_value$$inline_575$$ ? "on" : "", $element$$90$$.setAttribute("unselectable", $unselectable$$inline_572_value$$inline_575$$), $descendants$$inline_574$$) {
        for($i$$inline_576$$ = 0;$descendant$$inline_577$$ = $descendants$$inline_574$$[$i$$inline_576$$];$i$$inline_576$$++) {
          $descendant$$inline_577$$.setAttribute("unselectable", $unselectable$$inline_572_value$$inline_575$$)
        }
      }
    }
  }
};
$JSCompiler_prototypeAlias$$.$setRightToLeft$ = function $$JSCompiler_prototypeAlias$$$$setRightToLeft$$($element$$91$$, $rightToLeft$$2$$) {
  this.$enableClassName$($element$$91$$, this.$getCssClass$() + "-rtl", $rightToLeft$$2$$)
};
$JSCompiler_prototypeAlias$$.$isFocusable$ = function $$JSCompiler_prototypeAlias$$$$isFocusable$$($control$$6$$) {
  var $keyTarget$$;
  return $control$$6$$.$supportedStates_$ & 32 && ($keyTarget$$ = $control$$6$$.$getKeyEventTarget$()) ? $goog$dom$isFocusableTabIndex$$($keyTarget$$) : $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.$setFocusable$ = function $$JSCompiler_prototypeAlias$$$$setFocusable$$($control$$7$$, $focusable$$) {
  var $element$$inline_579_keyTarget$$1$$;
  if($control$$7$$.$supportedStates_$ & 32 && ($element$$inline_579_keyTarget$$1$$ = $control$$7$$.$getKeyEventTarget$())) {
    if(!$focusable$$ && $control$$7$$.$state_$ & 32) {
      try {
        $element$$inline_579_keyTarget$$1$$.blur()
      }catch($e$$39$$) {
      }
      $control$$7$$.$state_$ & 32 && $control$$7$$.$handleBlur$()
    }
    $goog$dom$isFocusableTabIndex$$($element$$inline_579_keyTarget$$1$$) != $focusable$$ && ($focusable$$ ? $element$$inline_579_keyTarget$$1$$.tabIndex = 0 : ($element$$inline_579_keyTarget$$1$$.tabIndex = -1, $element$$inline_579_keyTarget$$1$$.removeAttribute("tabIndex")))
  }
};
$JSCompiler_prototypeAlias$$.$setState$ = function $$JSCompiler_prototypeAlias$$$$setState$$($control$$8$$, $state$$3$$, $enable$$3$$) {
  var $element$$93$$ = $control$$8$$.$getElement$();
  if($element$$93$$) {
    var $className$$19$$;
    this.$classByState_$ || $JSCompiler_StaticMethods_createClassByStateMap_$$(this);
    ($className$$19$$ = this.$classByState_$[$state$$3$$]) && this.$enableClassName$($control$$8$$, $className$$19$$, $enable$$3$$);
    this.$updateAriaState$($element$$93$$, $state$$3$$, $enable$$3$$)
  }
};
$JSCompiler_prototypeAlias$$.$updateAriaState$ = function $$JSCompiler_prototypeAlias$$$$updateAriaState$$($element$$94$$, $ariaState_state$$4$$, $enable$$4$$) {
  $goog$ui$ControlRenderer$ARIA_STATE_MAP_$$ || ($goog$ui$ControlRenderer$ARIA_STATE_MAP_$$ = {1:"disabled", 8:"selected", 16:"checked", 64:"expanded"});
  ($ariaState_state$$4$$ = $goog$ui$ControlRenderer$ARIA_STATE_MAP_$$[$ariaState_state$$4$$]) && $element$$94$$.setAttribute("aria-" + $ariaState_state$$4$$, $enable$$4$$)
};
$JSCompiler_prototypeAlias$$.$setContent$ = function $$JSCompiler_prototypeAlias$$$$setContent$$($element$$95$$, $content$$7$$) {
  var $contentElem$$1$$ = this.$getContentElement$($element$$95$$);
  if($contentElem$$1$$ && ($goog$dom$removeChildren$$($contentElem$$1$$), $content$$7$$)) {
    if($goog$isString$$($content$$7$$)) {
      if("textContent" in $contentElem$$1$$) {
        $contentElem$$1$$.textContent = $content$$7$$
      }else {
        if($contentElem$$1$$.firstChild && 3 == $contentElem$$1$$.firstChild.nodeType) {
          for(;$contentElem$$1$$.lastChild != $contentElem$$1$$.firstChild;) {
            $contentElem$$1$$.removeChild($contentElem$$1$$.lastChild)
          }
          $contentElem$$1$$.firstChild.data = $content$$7$$
        }else {
          $goog$dom$removeChildren$$($contentElem$$1$$), $contentElem$$1$$.appendChild($goog$dom$getOwnerDocument$$($contentElem$$1$$).createTextNode($content$$7$$))
        }
      }
    }else {
      var $childHandler$$1$$ = function $$childHandler$$1$$$($child$$16$$) {
        if($child$$16$$) {
          var $doc$$34$$ = $goog$dom$getOwnerDocument$$($contentElem$$1$$);
          $contentElem$$1$$.appendChild($goog$isString$$($child$$16$$) ? $doc$$34$$.createTextNode($child$$16$$) : $child$$16$$)
        }
      };
      $goog$isArray$$($content$$7$$) ? $goog$array$forEach$$($content$$7$$, $childHandler$$1$$) : $goog$isArrayLike$$($content$$7$$) && !("nodeType" in $content$$7$$) ? $goog$array$forEach$$($goog$array$toArray$$($content$$7$$), $childHandler$$1$$) : $childHandler$$1$$($content$$7$$)
    }
  }
};
$JSCompiler_prototypeAlias$$.$getKeyEventTarget$ = function $$JSCompiler_prototypeAlias$$$$getKeyEventTarget$$($control$$9$$) {
  return $control$$9$$.$getElement$()
};
$JSCompiler_prototypeAlias$$.$getCssClass$ = $JSCompiler_returnArg$$("goog-control");
function $JSCompiler_StaticMethods_getAppliedCombinedClassNames_$$($classes$$5$$, $opt_includedClass$$) {
  var $toAdd$$ = [];
  $opt_includedClass$$ && ($classes$$5$$ = $classes$$5$$.concat([$opt_includedClass$$]));
  $goog$array$forEach$$([], function($combo$$) {
    $goog$array$every$$($combo$$, $goog$partial$$($goog$array$contains$$, $classes$$5$$)) && (!$opt_includedClass$$ || $goog$array$contains$$($combo$$, $opt_includedClass$$)) && $toAdd$$.push($combo$$.join("_"))
  });
  return $toAdd$$
}
function $JSCompiler_StaticMethods_createClassByStateMap_$$($JSCompiler_StaticMethods_createClassByStateMap_$self$$) {
  var $baseClass$$ = $JSCompiler_StaticMethods_createClassByStateMap_$self$$.$getCssClass$();
  $JSCompiler_StaticMethods_createClassByStateMap_$self$$.$classByState_$ = {1:$baseClass$$ + "-disabled", 2:$baseClass$$ + "-hover", 4:$baseClass$$ + "-active", 8:$baseClass$$ + "-selected", 16:$baseClass$$ + "-checked", 32:$baseClass$$ + "-focused", 64:$baseClass$$ + "-open"}
}
;var $goog$ui$registry$defaultRenderers_$$ = {};
function $goog$ui$Control$$($content$$8$$, $JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$, $opt_domHelper$$3$$) {
  $goog$ui$Component$$.call(this, $opt_domHelper$$3$$);
  if(!$JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$) {
    for(var $JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$ = this.constructor, $key$$inline_593_rendererCtor$$inline_594$$;$JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$;) {
      $key$$inline_593_rendererCtor$$inline_594$$ = $goog$getUid$$($JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$);
      if($key$$inline_593_rendererCtor$$inline_594$$ = $goog$ui$registry$defaultRenderers_$$[$key$$inline_593_rendererCtor$$inline_594$$]) {
        break
      }
      $JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$ = $JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$.$superClass_$ ? $JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$.$superClass_$.constructor : $JSCompiler_alias_NULL$$
    }
    $JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$ = $key$$inline_593_rendererCtor$$inline_594$$ ? $goog$isFunction$$($key$$inline_593_rendererCtor$$inline_594$$.$getInstance$) ? $key$$inline_593_rendererCtor$$inline_594$$.$getInstance$() : new $key$$inline_593_rendererCtor$$inline_594$$ : $JSCompiler_alias_NULL$$
  }
  this.$renderer_$ = $JSCompiler_temp$$23_componentCtor$$inline_592_opt_renderer$$;
  this.$content_$ = $content$$8$$
}
$goog$inherits$$($goog$ui$Control$$, $goog$ui$Component$$);
$JSCompiler_prototypeAlias$$ = $goog$ui$Control$$.prototype;
$JSCompiler_prototypeAlias$$.$content_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$state_$ = 0;
$JSCompiler_prototypeAlias$$.$supportedStates_$ = 39;
$JSCompiler_prototypeAlias$$.$autoStates_$ = 255;
$JSCompiler_prototypeAlias$$.$statesWithTransitionEvents_$ = 0;
$JSCompiler_prototypeAlias$$.$visible_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.$extraClassNames_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$handleMouseEvents_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.$allowTextSelection_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$preferredAriaRole_$ = $JSCompiler_alias_NULL$$;
function $JSCompiler_StaticMethods_setHandleMouseEvents$$($JSCompiler_StaticMethods_setHandleMouseEvents$self$$) {
  $JSCompiler_StaticMethods_setHandleMouseEvents$self$$.$inDocument_$ && $JSCompiler_alias_FALSE$$ != $JSCompiler_StaticMethods_setHandleMouseEvents$self$$.$handleMouseEvents_$ && $JSCompiler_StaticMethods_enableMouseEventHandling_$$($JSCompiler_StaticMethods_setHandleMouseEvents$self$$, $JSCompiler_alias_FALSE$$);
  $JSCompiler_StaticMethods_setHandleMouseEvents$self$$.$handleMouseEvents_$ = $JSCompiler_alias_FALSE$$
}
$JSCompiler_prototypeAlias$$.$getKeyEventTarget$ = function $$JSCompiler_prototypeAlias$$$$getKeyEventTarget$$() {
  return this.$renderer_$.$getKeyEventTarget$(this)
};
$JSCompiler_prototypeAlias$$.$enableClassName$ = function $$JSCompiler_prototypeAlias$$$$enableClassName$$($className$$25$$, $enable$$6$$) {
  $enable$$6$$ ? $className$$25$$ && (this.$extraClassNames_$ ? $goog$array$contains$$(this.$extraClassNames_$, $className$$25$$) || this.$extraClassNames_$.push($className$$25$$) : this.$extraClassNames_$ = [$className$$25$$], this.$renderer_$.$enableClassName$(this, $className$$25$$, $JSCompiler_alias_TRUE$$)) : $className$$25$$ && this.$extraClassNames_$ && ($goog$array$remove$$(this.$extraClassNames_$, $className$$25$$), 0 == this.$extraClassNames_$.length && (this.$extraClassNames_$ = $JSCompiler_alias_NULL$$),
  this.$renderer_$.$enableClassName$(this, $className$$25$$, $JSCompiler_alias_FALSE$$))
};
$JSCompiler_prototypeAlias$$.$getContentElement$ = function $$JSCompiler_prototypeAlias$$$$getContentElement$$() {
  return this.$renderer_$.$getContentElement$(this.$getElement$())
};
$JSCompiler_prototypeAlias$$.$canDecorate$ = function $$JSCompiler_prototypeAlias$$$$canDecorate$$($element$$99$$) {
  return this.$renderer_$.$canDecorate$($element$$99$$)
};
$JSCompiler_prototypeAlias$$.$decorateInternal$ = function $$JSCompiler_prototypeAlias$$$$decorateInternal$$($element$$100$$) {
  this.$element_$ = $element$$100$$ = this.$renderer_$.$decorate$(this, $element$$100$$);
  var $ariaRole$$inline_620$$ = this.$preferredAriaRole_$ || $JSCompiler_alias_VOID$$;
  $ariaRole$$inline_620$$ && $element$$100$$.setAttribute("role", $ariaRole$$inline_620$$);
  this.$allowTextSelection_$ || this.$renderer_$.$setAllowTextSelection$($element$$100$$, $JSCompiler_alias_FALSE$$);
  this.$visible_$ = "none" != $element$$100$$.style.display
};
$JSCompiler_prototypeAlias$$.$enterDocument$ = function $$JSCompiler_prototypeAlias$$$$enterDocument$$() {
  $goog$ui$Control$$.$superClass_$.$enterDocument$.call(this);
  var $JSCompiler_StaticMethods_initializeDom$self$$inline_622_keyTarget$$2$$ = this.$renderer_$;
  this.$rightToLeft_$ == $JSCompiler_alias_NULL$$ && (this.$rightToLeft_$ = $goog$style$isRightToLeft$$(this.$inDocument_$ ? this.$element_$ : this.$dom_$.$document_$.body));
  this.$rightToLeft_$ && $JSCompiler_StaticMethods_initializeDom$self$$inline_622_keyTarget$$2$$.$setRightToLeft$(this.$getElement$(), $JSCompiler_alias_TRUE$$);
  this.isEnabled() && $JSCompiler_StaticMethods_initializeDom$self$$inline_622_keyTarget$$2$$.$setFocusable$(this, this.$visible_$);
  if(this.$supportedStates_$ & -2 && (this.$handleMouseEvents_$ && $JSCompiler_StaticMethods_enableMouseEventHandling_$$(this, $JSCompiler_alias_TRUE$$), this.$supportedStates_$ & 32 && ($JSCompiler_StaticMethods_initializeDom$self$$inline_622_keyTarget$$2$$ = this.$getKeyEventTarget$()))) {
    var $keyHandler$$ = this.$keyHandler_$ || (this.$keyHandler_$ = new $goog$events$KeyHandler$$);
    $JSCompiler_StaticMethods_attach$$($keyHandler$$, $JSCompiler_StaticMethods_initializeDom$self$$inline_622_keyTarget$$2$$);
    $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$$(this.$getHandler$(), $keyHandler$$, "key", this.$handleKeyEvent$), $JSCompiler_StaticMethods_initializeDom$self$$inline_622_keyTarget$$2$$, "focus", this.$handleFocus$), $JSCompiler_StaticMethods_initializeDom$self$$inline_622_keyTarget$$2$$, "blur", this.$handleBlur$)
  }
};
function $JSCompiler_StaticMethods_enableMouseEventHandling_$$($JSCompiler_StaticMethods_enableMouseEventHandling_$self$$, $enable$$7$$) {
  var $handler$$9$$ = $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$getHandler$(), $element$$101$$ = $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$getElement$();
  $enable$$7$$ ? ($JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$$($handler$$9$$, $element$$101$$, "mouseover", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleMouseOver$), $element$$101$$, "mousedown", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleMouseDown$), $element$$101$$, "mouseup", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleMouseUp$), $element$$101$$,
  "mouseout", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleMouseOut$), $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleContextMenu$ != $goog$nullFunction$$ && $JSCompiler_StaticMethods_listen$$($handler$$9$$, $element$$101$$, "contextmenu", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleContextMenu$), $goog$userAgent$IE$$ && $JSCompiler_StaticMethods_listen$$($handler$$9$$, $element$$101$$, "dblclick", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleDblClick$)) :
  ($JSCompiler_StaticMethods_unlisten$$($JSCompiler_StaticMethods_unlisten$$($JSCompiler_StaticMethods_unlisten$$($JSCompiler_StaticMethods_unlisten$$($handler$$9$$, $element$$101$$, "mouseover", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleMouseOver$), $element$$101$$, "mousedown", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleMouseDown$), $element$$101$$, "mouseup", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleMouseUp$), $element$$101$$,
  "mouseout", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleMouseOut$), $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleContextMenu$ != $goog$nullFunction$$ && $JSCompiler_StaticMethods_unlisten$$($handler$$9$$, $element$$101$$, "contextmenu", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleContextMenu$), $goog$userAgent$IE$$ && $JSCompiler_StaticMethods_unlisten$$($handler$$9$$, $element$$101$$, "dblclick", $JSCompiler_StaticMethods_enableMouseEventHandling_$self$$.$handleDblClick$))
}
$JSCompiler_prototypeAlias$$.$exitDocument$ = function $$JSCompiler_prototypeAlias$$$$exitDocument$$() {
  $goog$ui$Control$$.$superClass_$.$exitDocument$.call(this);
  this.$keyHandler_$ && this.$keyHandler_$.detach();
  this.$visible_$ && this.isEnabled() && this.$renderer_$.$setFocusable$(this, $JSCompiler_alias_FALSE$$)
};
$JSCompiler_prototypeAlias$$.$setContent$ = function $$JSCompiler_prototypeAlias$$$$setContent$$($content$$9$$) {
  this.$renderer_$.$setContent$(this.$getElement$(), $content$$9$$);
  this.$content_$ = $content$$9$$
};
$JSCompiler_prototypeAlias$$.$setRightToLeft$ = function $$JSCompiler_prototypeAlias$$$$setRightToLeft$$($rightToLeft$$3$$) {
  $goog$ui$Control$$.$superClass_$.$setRightToLeft$.call(this, $rightToLeft$$3$$);
  var $element$$102$$ = this.$getElement$();
  $element$$102$$ && this.$renderer_$.$setRightToLeft$($element$$102$$, $rightToLeft$$3$$)
};
$JSCompiler_prototypeAlias$$.$setAllowTextSelection$ = function $$JSCompiler_prototypeAlias$$$$setAllowTextSelection$$($allow$$1$$) {
  this.$allowTextSelection_$ = $allow$$1$$;
  var $element$$103$$ = this.$getElement$();
  $element$$103$$ && this.$renderer_$.$setAllowTextSelection$($element$$103$$, $allow$$1$$)
};
$JSCompiler_prototypeAlias$$.isEnabled = function $$JSCompiler_prototypeAlias$$$isEnabled$() {
  return!(this.$state_$ & 1)
};
function $JSCompiler_StaticMethods_setHighlighted$$($JSCompiler_StaticMethods_setHighlighted$self$$, $highlight$$1$$) {
  $JSCompiler_StaticMethods_isTransitionAllowed$$($JSCompiler_StaticMethods_setHighlighted$self$$, 2, $highlight$$1$$) && $JSCompiler_StaticMethods_setHighlighted$self$$.$setState$(2, $highlight$$1$$)
}
$JSCompiler_prototypeAlias$$.setActive = function $$JSCompiler_prototypeAlias$$$setActive$($active$$) {
  $JSCompiler_StaticMethods_isTransitionAllowed$$(this, 4, $active$$) && this.$setState$(4, $active$$)
};
$JSCompiler_prototypeAlias$$.$setState$ = function $$JSCompiler_prototypeAlias$$$$setState$$($state$$9$$, $enable$$9$$) {
  this.$supportedStates_$ & $state$$9$$ && $enable$$9$$ != !!(this.$state_$ & $state$$9$$) && (this.$renderer_$.$setState$(this, $state$$9$$, $enable$$9$$), this.$state_$ = $enable$$9$$ ? this.$state_$ | $state$$9$$ : this.$state_$ & ~$state$$9$$)
};
function $JSCompiler_StaticMethods_isAutoState$$($JSCompiler_StaticMethods_isAutoState$self$$, $state$$13$$) {
  return!!($JSCompiler_StaticMethods_isAutoState$self$$.$autoStates_$ & $state$$13$$) && !!($JSCompiler_StaticMethods_isAutoState$self$$.$supportedStates_$ & $state$$13$$)
}
function $JSCompiler_StaticMethods_isTransitionAllowed$$($JSCompiler_StaticMethods_isTransitionAllowed$self$$, $state$$15$$, $enable$$12$$) {
  return!!($JSCompiler_StaticMethods_isTransitionAllowed$self$$.$supportedStates_$ & $state$$15$$) && !!($JSCompiler_StaticMethods_isTransitionAllowed$self$$.$state_$ & $state$$15$$) != $enable$$12$$ && (!($JSCompiler_StaticMethods_isTransitionAllowed$self$$.$statesWithTransitionEvents_$ & $state$$15$$) || $JSCompiler_StaticMethods_isTransitionAllowed$self$$.dispatchEvent($goog$ui$Component$getStateTransitionEvent$$($state$$15$$, $enable$$12$$))) && !$JSCompiler_StaticMethods_isTransitionAllowed$self$$.$disposed_$
}
$JSCompiler_prototypeAlias$$.$handleMouseOver$ = function $$JSCompiler_prototypeAlias$$$$handleMouseOver$$($e$$40$$) {
  (!$e$$40$$.relatedTarget || !$goog$dom$contains$$(this.$getElement$(), $e$$40$$.relatedTarget)) && (this.dispatchEvent("enter") && this.isEnabled() && $JSCompiler_StaticMethods_isAutoState$$(this, 2)) && $JSCompiler_StaticMethods_setHighlighted$$(this, $JSCompiler_alias_TRUE$$)
};
$JSCompiler_prototypeAlias$$.$handleMouseOut$ = function $$JSCompiler_prototypeAlias$$$$handleMouseOut$$($e$$41$$) {
  if((!$e$$41$$.relatedTarget || !$goog$dom$contains$$(this.$getElement$(), $e$$41$$.relatedTarget)) && this.dispatchEvent("leave")) {
    $JSCompiler_StaticMethods_isAutoState$$(this, 4) && this.setActive($JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_isAutoState$$(this, 2) && $JSCompiler_StaticMethods_setHighlighted$$(this, $JSCompiler_alias_FALSE$$)
  }
};
$JSCompiler_prototypeAlias$$.$handleContextMenu$ = $goog$nullFunction$$;
$JSCompiler_prototypeAlias$$.$handleMouseDown$ = function $$JSCompiler_prototypeAlias$$$$handleMouseDown$$($e$$43$$) {
  this.isEnabled() && ($JSCompiler_StaticMethods_isAutoState$$(this, 2) && $JSCompiler_StaticMethods_setHighlighted$$(this, $JSCompiler_alias_TRUE$$), $JSCompiler_StaticMethods_isMouseActionButton$$($e$$43$$) && ($JSCompiler_StaticMethods_isAutoState$$(this, 4) && this.setActive($JSCompiler_alias_TRUE$$), this.$renderer_$.$isFocusable$(this) && this.$getKeyEventTarget$().focus()));
  !this.$allowTextSelection_$ && $JSCompiler_StaticMethods_isMouseActionButton$$($e$$43$$) && $e$$43$$.preventDefault()
};
$JSCompiler_prototypeAlias$$.$handleMouseUp$ = function $$JSCompiler_prototypeAlias$$$$handleMouseUp$$($e$$44$$) {
  this.isEnabled() && ($JSCompiler_StaticMethods_isAutoState$$(this, 2) && $JSCompiler_StaticMethods_setHighlighted$$(this, $JSCompiler_alias_TRUE$$), this.$state_$ & 4 && ($JSCompiler_StaticMethods_performActionInternal$$(this, $e$$44$$) && $JSCompiler_StaticMethods_isAutoState$$(this, 4)) && this.setActive($JSCompiler_alias_FALSE$$))
};
$JSCompiler_prototypeAlias$$.$handleDblClick$ = function $$JSCompiler_prototypeAlias$$$$handleDblClick$$($e$$45$$) {
  this.isEnabled() && $JSCompiler_StaticMethods_performActionInternal$$(this, $e$$45$$)
};
function $JSCompiler_StaticMethods_performActionInternal$$($JSCompiler_StaticMethods_performActionInternal$self$$, $e$$46$$) {
  if($JSCompiler_StaticMethods_isAutoState$$($JSCompiler_StaticMethods_performActionInternal$self$$, 16)) {
    var $actionEvent_check$$inline_629_open$$inline_635$$ = !($JSCompiler_StaticMethods_performActionInternal$self$$.$state_$ & 16);
    $JSCompiler_StaticMethods_isTransitionAllowed$$($JSCompiler_StaticMethods_performActionInternal$self$$, 16, $actionEvent_check$$inline_629_open$$inline_635$$) && $JSCompiler_StaticMethods_performActionInternal$self$$.$setState$(16, $actionEvent_check$$inline_629_open$$inline_635$$)
  }
  $JSCompiler_StaticMethods_isAutoState$$($JSCompiler_StaticMethods_performActionInternal$self$$, 8) && $JSCompiler_StaticMethods_isTransitionAllowed$$($JSCompiler_StaticMethods_performActionInternal$self$$, 8, $JSCompiler_alias_TRUE$$) && $JSCompiler_StaticMethods_performActionInternal$self$$.$setState$(8, $JSCompiler_alias_TRUE$$);
  $JSCompiler_StaticMethods_isAutoState$$($JSCompiler_StaticMethods_performActionInternal$self$$, 64) && ($actionEvent_check$$inline_629_open$$inline_635$$ = !($JSCompiler_StaticMethods_performActionInternal$self$$.$state_$ & 64), $JSCompiler_StaticMethods_isTransitionAllowed$$($JSCompiler_StaticMethods_performActionInternal$self$$, 64, $actionEvent_check$$inline_629_open$$inline_635$$) && $JSCompiler_StaticMethods_performActionInternal$self$$.$setState$(64, $actionEvent_check$$inline_629_open$$inline_635$$));
  $actionEvent_check$$inline_629_open$$inline_635$$ = new $goog$events$Event$$("action", $JSCompiler_StaticMethods_performActionInternal$self$$);
  $e$$46$$ && ($actionEvent_check$$inline_629_open$$inline_635$$.altKey = $e$$46$$.altKey, $actionEvent_check$$inline_629_open$$inline_635$$.ctrlKey = $e$$46$$.ctrlKey, $actionEvent_check$$inline_629_open$$inline_635$$.metaKey = $e$$46$$.metaKey, $actionEvent_check$$inline_629_open$$inline_635$$.shiftKey = $e$$46$$.shiftKey, $actionEvent_check$$inline_629_open$$inline_635$$.$platformModifierKey$ = $e$$46$$.$platformModifierKey$);
  return $JSCompiler_StaticMethods_performActionInternal$self$$.dispatchEvent($actionEvent_check$$inline_629_open$$inline_635$$)
}
$JSCompiler_prototypeAlias$$.$handleFocus$ = function $$JSCompiler_prototypeAlias$$$$handleFocus$$() {
  $JSCompiler_StaticMethods_isAutoState$$(this, 32) && $JSCompiler_StaticMethods_isTransitionAllowed$$(this, 32, $JSCompiler_alias_TRUE$$) && this.$setState$(32, $JSCompiler_alias_TRUE$$)
};
$JSCompiler_prototypeAlias$$.$handleBlur$ = function $$JSCompiler_prototypeAlias$$$$handleBlur$$() {
  $JSCompiler_StaticMethods_isAutoState$$(this, 4) && this.setActive($JSCompiler_alias_FALSE$$);
  $JSCompiler_StaticMethods_isAutoState$$(this, 32) && $JSCompiler_StaticMethods_isTransitionAllowed$$(this, 32, $JSCompiler_alias_FALSE$$) && this.$setState$(32, $JSCompiler_alias_FALSE$$)
};
$JSCompiler_prototypeAlias$$.$handleKeyEvent$ = function $$JSCompiler_prototypeAlias$$$$handleKeyEvent$$($e$$49$$) {
  return this.$visible_$ && this.isEnabled() && 13 == $e$$49$$.keyCode && $JSCompiler_StaticMethods_performActionInternal$$(this, $e$$49$$) ? ($e$$49$$.preventDefault(), $e$$49$$.stopPropagation(), $JSCompiler_alias_TRUE$$) : $JSCompiler_alias_FALSE$$
};
$goog$isFunction$$($goog$ui$Control$$) || $JSCompiler_alias_THROW$$(Error("Invalid component class " + $goog$ui$Control$$));
$goog$isFunction$$($goog$ui$ControlRenderer$$) || $JSCompiler_alias_THROW$$(Error("Invalid renderer class " + $goog$ui$ControlRenderer$$));
var $key$$inline_645$$ = $goog$getUid$$($goog$ui$Control$$);
$goog$ui$registry$defaultRenderers_$$[$key$$inline_645$$] = $goog$ui$ControlRenderer$$;
function $decoratorFn$$inline_647$$() {
  return new $goog$ui$Control$$($JSCompiler_alias_NULL$$)
}
$goog$isFunction$$($decoratorFn$$inline_647$$) || $JSCompiler_alias_THROW$$(Error("Invalid decorator function " + $decoratorFn$$inline_647$$));
function $goog$ui$TextareaRenderer$$() {
}
$goog$inherits$$($goog$ui$TextareaRenderer$$, $goog$ui$ControlRenderer$$);
$goog$addSingletonGetter$$($goog$ui$TextareaRenderer$$);
$JSCompiler_prototypeAlias$$ = $goog$ui$TextareaRenderer$$.prototype;
$JSCompiler_prototypeAlias$$.$decorate$ = function $$JSCompiler_prototypeAlias$$$$decorate$$($control$$11$$, $element$$105$$) {
  $JSCompiler_StaticMethods_setHandleMouseEvents$$($control$$11$$);
  $control$$11$$.$autoStates_$ &= -256;
  $control$$11$$.$inDocument_$ && $control$$11$$.$state_$ & 32 && $JSCompiler_alias_THROW$$(Error("Component already rendered"));
  $control$$11$$.$state_$ & 32 && $control$$11$$.$setState$(32, $JSCompiler_alias_FALSE$$);
  $control$$11$$.$supportedStates_$ &= -33;
  $goog$ui$TextareaRenderer$$.$superClass_$.$decorate$.call(this, $control$$11$$, $element$$105$$);
  $control$$11$$.$setContent$($element$$105$$.value);
  return $element$$105$$
};
$JSCompiler_prototypeAlias$$.$canDecorate$ = function $$JSCompiler_prototypeAlias$$$$canDecorate$$($element$$107$$) {
  return"TEXTAREA" == $element$$107$$.tagName
};
$JSCompiler_prototypeAlias$$.$setRightToLeft$ = $goog$nullFunction$$;
$JSCompiler_prototypeAlias$$.$isFocusable$ = function $$JSCompiler_prototypeAlias$$$$isFocusable$$($textarea$$1$$) {
  return $textarea$$1$$.isEnabled()
};
$JSCompiler_prototypeAlias$$.$setFocusable$ = $goog$nullFunction$$;
$JSCompiler_prototypeAlias$$.$setState$ = function $$JSCompiler_prototypeAlias$$$$setState$$($element$$108_textarea$$2$$, $state$$16$$, $enable$$13$$) {
  $goog$ui$TextareaRenderer$$.$superClass_$.$setState$.call(this, $element$$108_textarea$$2$$, $state$$16$$, $enable$$13$$);
  if(($element$$108_textarea$$2$$ = $element$$108_textarea$$2$$.$getElement$()) && 1 == $state$$16$$) {
    $element$$108_textarea$$2$$.disabled = $enable$$13$$
  }
};
$JSCompiler_prototypeAlias$$.$updateAriaState$ = $goog$nullFunction$$;
$JSCompiler_prototypeAlias$$.$setContent$ = function $$JSCompiler_prototypeAlias$$$$setContent$$($element$$109$$, $value$$104$$) {
  $element$$109$$ && ($element$$109$$.value = $value$$104$$)
};
$JSCompiler_prototypeAlias$$.$getCssClass$ = $JSCompiler_returnArg$$("goog-textarea");
function $goog$ui$Textarea$$($content$$12$$, $opt_renderer$$1$$, $opt_domHelper$$4$$) {
  $goog$ui$Control$$.call(this, $content$$12$$, $opt_renderer$$1$$ || $goog$ui$TextareaRenderer$$.$getInstance$(), $opt_domHelper$$4$$);
  $JSCompiler_StaticMethods_setHandleMouseEvents$$(this);
  this.$setAllowTextSelection$($JSCompiler_alias_TRUE$$);
  $content$$12$$ || (this.$content_$ = "")
}
$goog$inherits$$($goog$ui$Textarea$$, $goog$ui$Control$$);
var $goog$ui$Textarea$NEEDS_HELP_SHRINKING_$$ = $goog$userAgent$GECKO$$ || $goog$userAgent$WEBKIT$$;
$JSCompiler_prototypeAlias$$ = $goog$ui$Textarea$$.prototype;
$JSCompiler_prototypeAlias$$.$isResizing_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$height_$ = 0;
$JSCompiler_prototypeAlias$$.$maxHeight_$ = 0;
$JSCompiler_prototypeAlias$$.$minHeight_$ = 0;
$JSCompiler_prototypeAlias$$.$hasDiscoveredTextareaCharacteristics_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$needsPaddingBorderFix_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$scrollHeightIncludesPadding_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$scrollHeightIncludesBorder_$ = $JSCompiler_alias_FALSE$$;
function $JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$$($JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$self$$) {
  return $JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$self$$.$paddingBox_$.top + $JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$self$$.$paddingBox_$.bottom + $JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$self$$.$borderBox_$.top + $JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$self$$.$borderBox_$.bottom
}
function $JSCompiler_StaticMethods_getMinHeight_$$($JSCompiler_StaticMethods_getMinHeight_$self$$) {
  var $minHeight$$ = $JSCompiler_StaticMethods_getMinHeight_$self$$.$minHeight_$, $textarea$$4$$ = $JSCompiler_StaticMethods_getMinHeight_$self$$.$getElement$();
  $minHeight$$ && ($textarea$$4$$ && $JSCompiler_StaticMethods_getMinHeight_$self$$.$needsPaddingBorderFix_$) && ($minHeight$$ -= $JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$$($JSCompiler_StaticMethods_getMinHeight_$self$$));
  return $minHeight$$
}
function $JSCompiler_StaticMethods_getMaxHeight_$$($JSCompiler_StaticMethods_getMaxHeight_$self$$) {
  var $maxHeight$$ = $JSCompiler_StaticMethods_getMaxHeight_$self$$.$maxHeight_$, $textarea$$5$$ = $JSCompiler_StaticMethods_getMaxHeight_$self$$.$getElement$();
  $maxHeight$$ && ($textarea$$5$$ && $JSCompiler_StaticMethods_getMaxHeight_$self$$.$needsPaddingBorderFix_$) && ($maxHeight$$ -= $JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$$($JSCompiler_StaticMethods_getMaxHeight_$self$$));
  return $maxHeight$$
}
$JSCompiler_prototypeAlias$$.$setContent$ = function $$JSCompiler_prototypeAlias$$$$setContent$$($content$$13$$) {
  $goog$ui$Textarea$$.$superClass_$.$setContent$.call(this, $content$$13$$);
  this.$getElement$() && this.$grow_$()
};
$JSCompiler_prototypeAlias$$.$enterDocument$ = function $$JSCompiler_prototypeAlias$$$$enterDocument$$() {
  $goog$ui$Textarea$$.$superClass_$.$enterDocument$.call(this);
  var $textarea$$6$$ = this.$getElement$();
  $goog$style$setStyle$$($textarea$$6$$, {overflowY:"hidden", overflowX:"auto", boxSizing:"border-box", MsBoxSizing:"border-box", WebkitBoxSizing:"border-box", MozBoxSizing:"border-box"});
  this.$paddingBox_$ = $goog$style$getBox_$$($textarea$$6$$, "padding");
  this.$borderBox_$ = $goog$style$getBorderBox$$($textarea$$6$$);
  $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$$(this.$getHandler$(), $textarea$$6$$, "scroll", this.$grow_$), $textarea$$6$$, "focus", this.$grow_$), $textarea$$6$$, "keyup", this.$grow_$), $textarea$$6$$, "mouseup", this.$mouseUpListener_$);
  this.$getElement$() && this.$grow_$()
};
function $JSCompiler_StaticMethods_getHeight_$$($JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$) {
  if(!$JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$hasDiscoveredTextareaCharacteristics_$) {
    var $textarea$$7_textarea$$inline_662$$ = $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$getElement$().cloneNode($JSCompiler_alias_FALSE$$);
    $goog$style$setStyle$$($textarea$$7_textarea$$inline_662$$, {position:"absolute", height:"auto", top:"-9999px", margin:"0", padding:"1px", border:"1px solid #000", overflow:"hidden"});
    $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$getDomHelper$().$document_$.body.appendChild($textarea$$7_textarea$$inline_662$$);
    var $JSCompiler_temp_const$$12_height$$21_initialScrollHeight$$inline_663$$ = $textarea$$7_textarea$$inline_662$$.scrollHeight;
    $textarea$$7_textarea$$inline_662$$.style.padding = "10px";
    var $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ = $textarea$$7_textarea$$inline_662$$.scrollHeight;
    $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$scrollHeightIncludesPadding_$ = $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ > $JSCompiler_temp_const$$12_height$$21_initialScrollHeight$$inline_663$$;
    $textarea$$7_textarea$$inline_662$$.style.borderWidth = "10px";
    $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$scrollHeightIncludesBorder_$ = $textarea$$7_textarea$$inline_662$$.scrollHeight > $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$;
    $textarea$$7_textarea$$inline_662$$.style.height = "100px";
    100 != $textarea$$7_textarea$$inline_662$$.offsetHeight && ($JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$needsPaddingBorderFix_$ = $JSCompiler_alias_TRUE$$);
    $goog$dom$removeNode$$($textarea$$7_textarea$$inline_662$$);
    $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$hasDiscoveredTextareaCharacteristics_$ = $JSCompiler_alias_TRUE$$
  }
  var $textarea$$7_textarea$$inline_662$$ = $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$getElement$(), $JSCompiler_temp_const$$12_height$$21_initialScrollHeight$$inline_663$$ = $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$getElement$().scrollHeight, $borderBox$$inline_670_textarea$$inline_667$$ = $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$getElement$(), $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ = $borderBox$$inline_670_textarea$$inline_667$$.offsetHeight -
  $borderBox$$inline_670_textarea$$inline_667$$.clientHeight;
  if(!$JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$scrollHeightIncludesPadding_$) {
    var $paddingBox$$inline_669$$ = $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$paddingBox_$, $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ = $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ - ($paddingBox$$inline_669$$.top + $paddingBox$$inline_669$$.bottom)
  }
  $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$scrollHeightIncludesBorder_$ || ($borderBox$$inline_670_textarea$$inline_667$$ = $goog$style$getBorderBox$$($borderBox$$inline_670_textarea$$inline_667$$), $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ -= $borderBox$$inline_670_textarea$$inline_667$$.top + $borderBox$$inline_670_textarea$$inline_667$$.bottom);
  $JSCompiler_temp_const$$12_height$$21_initialScrollHeight$$inline_663$$ += 0 < $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ ? $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ : 0;
  $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$needsPaddingBorderFix_$ ? $JSCompiler_temp_const$$12_height$$21_initialScrollHeight$$inline_663$$ -= $JSCompiler_StaticMethods_getPaddingBorderBoxHeight_$$($JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$) : ($JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$scrollHeightIncludesPadding_$ || ($height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$ = $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$paddingBox_$,
  $JSCompiler_temp_const$$12_height$$21_initialScrollHeight$$inline_663$$ += $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$.top + $height$$inline_668_paddingBox$$3_paddingScrollHeight$$inline_664$$.bottom), $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.$scrollHeightIncludesBorder_$ || ($JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$ = $goog$style$getBorderBox$$($textarea$$7_textarea$$inline_662$$), $JSCompiler_temp_const$$12_height$$21_initialScrollHeight$$inline_663$$ +=
  $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.top + $JSCompiler_StaticMethods_getHeight_$self_borderBox$$3$$.bottom));
  return $JSCompiler_temp_const$$12_height$$21_initialScrollHeight$$inline_663$$
}
function $JSCompiler_StaticMethods_setHeight_$$($JSCompiler_StaticMethods_setHeight_$self$$, $height$$22$$) {
  $JSCompiler_StaticMethods_setHeight_$self$$.$height_$ != $height$$22$$ && ($JSCompiler_StaticMethods_setHeight_$self$$.$height_$ = $height$$22$$, $JSCompiler_StaticMethods_setHeight_$self$$.$getElement$().style.height = $height$$22$$ + "px")
}
function $JSCompiler_StaticMethods_setHeightToEstimate_$$($JSCompiler_StaticMethods_setHeightToEstimate_$self_textarea$$8$$) {
  $JSCompiler_StaticMethods_setHeightToEstimate_$self_textarea$$8$$ = $JSCompiler_StaticMethods_setHeightToEstimate_$self_textarea$$8$$.$getElement$();
  $JSCompiler_StaticMethods_setHeightToEstimate_$self_textarea$$8$$.style.height = "auto";
  var $newlines$$ = $JSCompiler_StaticMethods_setHeightToEstimate_$self_textarea$$8$$.value.match(/\n/g) || [];
  $JSCompiler_StaticMethods_setHeightToEstimate_$self_textarea$$8$$.rows = $newlines$$.length + 1
}
$JSCompiler_prototypeAlias$$.$grow_$ = function $$JSCompiler_prototypeAlias$$$$grow_$$() {
  if(!this.$isResizing_$) {
    var $shouldCallShrink_textarea$$inline_676$$ = $JSCompiler_alias_FALSE$$;
    this.$isResizing_$ = $JSCompiler_alias_TRUE$$;
    var $isEmpty$$inline_677_textarea$$11$$ = this.$getElement$(), $oldHeight$$ = this.$height_$;
    if($isEmpty$$inline_677_textarea$$11$$.scrollHeight) {
      var $minHeight$$inline_680_setMinHeight$$ = $JSCompiler_alias_FALSE$$, $scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$ = $JSCompiler_alias_FALSE$$, $currentHeight$$inline_679_newHeight$$ = $JSCompiler_StaticMethods_getHeight_$$(this), $currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$ = $isEmpty$$inline_677_textarea$$11$$.offsetHeight, $minHeight$$1$$ = $JSCompiler_StaticMethods_getMinHeight_$$(this), $maxHeight$$1$$ = $JSCompiler_StaticMethods_getMaxHeight_$$(this);
      $minHeight$$1$$ && $currentHeight$$inline_679_newHeight$$ < $minHeight$$1$$ ? ($JSCompiler_StaticMethods_setHeight_$$(this, $minHeight$$1$$), $minHeight$$inline_680_setMinHeight$$ = $JSCompiler_alias_TRUE$$) : $maxHeight$$1$$ && $currentHeight$$inline_679_newHeight$$ > $maxHeight$$1$$ ? ($JSCompiler_StaticMethods_setHeight_$$(this, $maxHeight$$1$$), $isEmpty$$inline_677_textarea$$11$$.style.overflowY = "", $scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$ = $JSCompiler_alias_TRUE$$) :
      $currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$ != $currentHeight$$inline_679_newHeight$$ ? $JSCompiler_StaticMethods_setHeight_$$(this, $currentHeight$$inline_679_newHeight$$) : this.$height_$ || (this.$height_$ = $currentHeight$$inline_679_newHeight$$);
      !$minHeight$$inline_680_setMinHeight$$ && (!$scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$ && $goog$ui$Textarea$NEEDS_HELP_SHRINKING_$$) && ($shouldCallShrink_textarea$$inline_676$$ = $JSCompiler_alias_TRUE$$)
    }else {
      $JSCompiler_StaticMethods_setHeightToEstimate_$$(this)
    }
    this.$isResizing_$ = $JSCompiler_alias_FALSE$$;
    $shouldCallShrink_textarea$$inline_676$$ && ($shouldCallShrink_textarea$$inline_676$$ = this.$getElement$(), this.$isResizing_$ || (this.$isResizing_$ = $JSCompiler_alias_TRUE$$, $isEmpty$$inline_677_textarea$$11$$ = $JSCompiler_alias_FALSE$$, $shouldCallShrink_textarea$$inline_676$$.value || ($shouldCallShrink_textarea$$inline_676$$.value = " ", $isEmpty$$inline_677_textarea$$11$$ = $JSCompiler_alias_TRUE$$), ($scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$ = $shouldCallShrink_textarea$$inline_676$$.scrollHeight) ?
    ($currentHeight$$inline_679_newHeight$$ = $JSCompiler_StaticMethods_getHeight_$$(this), $minHeight$$inline_680_setMinHeight$$ = $JSCompiler_StaticMethods_getMinHeight_$$(this), $currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$ = $JSCompiler_StaticMethods_getMaxHeight_$$(this), !($minHeight$$inline_680_setMinHeight$$ && $currentHeight$$inline_679_newHeight$$ <= $minHeight$$inline_680_setMinHeight$$) && !($currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$ && $currentHeight$$inline_679_newHeight$$ >=
    $currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$) && ($currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$ = this.$paddingBox_$, $shouldCallShrink_textarea$$inline_676$$.style.paddingBottom = $currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$.bottom + 1 + "px", $JSCompiler_StaticMethods_getHeight_$$(this) == $currentHeight$$inline_679_newHeight$$ && ($shouldCallShrink_textarea$$inline_676$$.style.paddingBottom = $currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$.bottom +
    $scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$ + "px", $shouldCallShrink_textarea$$inline_676$$.scrollTop = 0, $scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$ = $JSCompiler_StaticMethods_getHeight_$$(this) - $scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$, $scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$ >= $minHeight$$inline_680_setMinHeight$$ ? $JSCompiler_StaticMethods_setHeight_$$(this, $scrollHeight$$inline_678_setMaxHeight_shrinkToHeight$$inline_683$$) :
    $JSCompiler_StaticMethods_setHeight_$$(this, $minHeight$$inline_680_setMinHeight$$)), $shouldCallShrink_textarea$$inline_676$$.style.paddingBottom = $currentHeight_maxHeight$$inline_681_paddingBox$$inline_682$$.bottom + "px")) : $JSCompiler_StaticMethods_setHeightToEstimate_$$(this), $isEmpty$$inline_677_textarea$$11$$ && ($shouldCallShrink_textarea$$inline_676$$.value = ""), this.$isResizing_$ = $JSCompiler_alias_FALSE$$));
    $oldHeight$$ != this.$height_$ && this.dispatchEvent("resize")
  }
};
$JSCompiler_prototypeAlias$$.$mouseUpListener_$ = function $$JSCompiler_prototypeAlias$$$$mouseUpListener_$$() {
  var $dropShadow_textarea$$13$$ = this.$getElement$(), $height$$24$$ = $dropShadow_textarea$$13$$.offsetHeight;
  $dropShadow_textarea$$13$$.filters && $dropShadow_textarea$$13$$.filters.length && ($dropShadow_textarea$$13$$ = $dropShadow_textarea$$13$$.filters.item("DXImageTransform.Microsoft.DropShadow")) && ($height$$24$$ -= $dropShadow_textarea$$13$$.offX);
  $height$$24$$ != this.$height_$ && (this.$height_$ = this.$minHeight_$ = $height$$24$$)
};
/*
 Portions of this code are from the google-caja project, received by
 Google under the Apache license (http://code.google.com/p/google-caja/).
 All other code is Copyright 2009 Google, Inc. All Rights Reserved.

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

*/
function $goog$string$html$HtmlParser$$() {
}
var $goog$string$html$HtmlParser$Entities$$ = {$lt$:"<", $gt$:">", $amp$:"&", $nbsp$:"\u00a0", $quot$:'"', $apos$:"'"}, $goog$string$html$HtmlParser$Elements$$ = {a:0, abbr:0, acronym:0, address:0, applet:16, area:2, b:0, base:18, basefont:18, bdo:0, big:0, blockquote:0, body:49, br:2, button:0, caption:0, center:0, cite:0, code:0, col:2, colgroup:1, dd:1, del:0, dfn:0, dir:0, div:0, dl:0, dt:1, em:0, fieldset:0, font:0, form:0, frame:18, frameset:16, h1:0, h2:0, h3:0, h4:0, h5:0, h6:0, head:49,
hr:2, html:49, i:0, iframe:20, img:2, input:2, ins:0, isindex:18, kbd:0, label:0, legend:0, li:1, link:18, map:0, menu:0, meta:18, noframes:20, noscript:20, object:16, ol:0, optgroup:0, option:1, p:1, param:18, pre:0, q:0, s:0, samp:0, script:20, select:0, small:0, span:0, strike:0, strong:0, style:20, sub:0, sup:0, table:0, tbody:1, td:1, textarea:8, tfoot:1, th:1, thead:1, title:24, tr:1, tt:0, u:0, ul:0, "var":0}, $goog$string$html$HtmlParser$AMP_RE_$$ = /&/g, $goog$string$html$HtmlParser$LOOSE_AMP_RE_$$ =
/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi, $goog$string$html$HtmlParser$LT_RE_$$ = /</g, $goog$string$html$HtmlParser$GT_RE_$$ = />/g, $goog$string$html$HtmlParser$QUOTE_RE_$$ = /\"/g, $goog$string$html$HtmlParser$EQUALS_RE_$$ = /=/g, $goog$string$html$HtmlParser$NULL_RE_$$ = /\0/g, $goog$string$html$HtmlParser$ENTITY_RE_$$ = /&(#\d+|#x[0-9A-Fa-f]+|\w+);/g, $goog$string$html$HtmlParser$DECIMAL_ESCAPE_RE_$$ = /^#(\d+)$/, $goog$string$html$HtmlParser$HEX_ESCAPE_RE_$$ = /^#x([0-9A-Fa-f]+)$/,
$goog$string$html$HtmlParser$INSIDE_TAG_TOKEN_$$ = RegExp("^\\s*(?:(?:([a-z][a-z-]*)(\\s*=\\s*(\"[^\"]*\"|'[^']*'|(?=[a-z][a-z-]*\\s*=)|[^>\"'\\s]*))?)|(/?>)|[^a-z\\s>]+)", "i"), $goog$string$html$HtmlParser$OUTSIDE_TAG_TOKEN_$$ = RegExp("^(?:&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);|<[!]--[\\s\\S]*?--\>|<!\\w[^>]*>|<\\?[^>*]*>|<(/)?([a-z][a-z0-9]*)|([^<&>]+)|([<&>]))", "i");
$goog$string$html$HtmlParser$$.prototype.parse = function $$goog$string$html$HtmlParser$$$$parse$($handler$$10$$, $htmlText$$) {
  var $htmlLower_i$$inline_691$$ = $JSCompiler_alias_NULL$$, $dataEnd_inTag$$1$$ = $JSCompiler_alias_FALSE$$, $attribs$$ = [], $tagName$$6$$, $eflags$$, $openTag$$;
  $handler$$10$$.$stack_$ = [];
  for($handler$$10$$.$ignoring_$ = $JSCompiler_alias_FALSE$$;$htmlText$$;) {
    var $decodedValue_encodedValue_m$$ = $htmlText$$.match($dataEnd_inTag$$1$$ ? $goog$string$html$HtmlParser$INSIDE_TAG_TOKEN_$$ : $goog$string$html$HtmlParser$OUTSIDE_TAG_TOKEN_$$), $htmlText$$ = $htmlText$$.substring($decodedValue_encodedValue_m$$[0].length);
    if($dataEnd_inTag$$1$$) {
      if($decodedValue_encodedValue_m$$[1]) {
        var $attribName$$ = $decodedValue_encodedValue_m$$[1].toLowerCase();
        if($decodedValue_encodedValue_m$$[2]) {
          $decodedValue_encodedValue_m$$ = $decodedValue_encodedValue_m$$[3];
          switch($decodedValue_encodedValue_m$$.charCodeAt(0)) {
            case 34:
            ;
            case 39:
              $decodedValue_encodedValue_m$$ = $decodedValue_encodedValue_m$$.substring(1, $decodedValue_encodedValue_m$$.length - 1)
          }
          $decodedValue_encodedValue_m$$ = $decodedValue_encodedValue_m$$.replace($goog$string$html$HtmlParser$NULL_RE_$$, "").replace($goog$string$html$HtmlParser$ENTITY_RE_$$, $goog$bind$$(this.$lookupEntity_$, this))
        }else {
          $decodedValue_encodedValue_m$$ = $attribName$$
        }
        $attribs$$.push($attribName$$, $decodedValue_encodedValue_m$$)
      }else {
        $decodedValue_encodedValue_m$$[4] && ($eflags$$ !== $JSCompiler_alias_VOID$$ && ($openTag$$ ? $handler$$10$$.$startTag$ && $handler$$10$$.$startTag$($tagName$$6$$, $attribs$$) : $handler$$10$$.$endTag$ && $handler$$10$$.$endTag$($tagName$$6$$)), $openTag$$ && $eflags$$ & 12 && ($htmlLower_i$$inline_691$$ = $htmlLower_i$$inline_691$$ === $JSCompiler_alias_NULL$$ ? $htmlText$$.toLowerCase() : $htmlLower_i$$inline_691$$.substring($htmlLower_i$$inline_691$$.length - $htmlText$$.length), $dataEnd_inTag$$1$$ =
        $htmlLower_i$$inline_691$$.indexOf("</" + $tagName$$6$$), 0 > $dataEnd_inTag$$1$$ && ($dataEnd_inTag$$1$$ = $htmlText$$.length), $eflags$$ & 4 ? $handler$$10$$.$cdata$ && $handler$$10$$.$cdata$($htmlText$$.substring(0, $dataEnd_inTag$$1$$)) : $handler$$10$$.$rcdata$ && $handler$$10$$.$rcdata$($htmlText$$.substring(0, $dataEnd_inTag$$1$$).replace($goog$string$html$HtmlParser$LOOSE_AMP_RE_$$, "&amp;$1").replace($goog$string$html$HtmlParser$LT_RE_$$, "&lt;").replace($goog$string$html$HtmlParser$GT_RE_$$,
        "&gt;")), $htmlText$$ = $htmlText$$.substring($dataEnd_inTag$$1$$)), $tagName$$6$$ = $eflags$$ = $openTag$$ = $JSCompiler_alias_VOID$$, $attribs$$.length = 0, $dataEnd_inTag$$1$$ = $JSCompiler_alias_FALSE$$)
      }
    }else {
      if($decodedValue_encodedValue_m$$[1]) {
        $JSCompiler_StaticMethods_pcdata$$($handler$$10$$, $decodedValue_encodedValue_m$$[0])
      }else {
        if($decodedValue_encodedValue_m$$[3]) {
          $openTag$$ = !$decodedValue_encodedValue_m$$[2], $dataEnd_inTag$$1$$ = $JSCompiler_alias_TRUE$$, $tagName$$6$$ = $decodedValue_encodedValue_m$$[3].toLowerCase(), $eflags$$ = $goog$string$html$HtmlParser$Elements$$.hasOwnProperty($tagName$$6$$) ? $goog$string$html$HtmlParser$Elements$$[$tagName$$6$$] : $JSCompiler_alias_VOID$$
        }else {
          if($decodedValue_encodedValue_m$$[4]) {
            $JSCompiler_StaticMethods_pcdata$$($handler$$10$$, $decodedValue_encodedValue_m$$[4])
          }else {
            if($decodedValue_encodedValue_m$$[5]) {
              switch($decodedValue_encodedValue_m$$[5]) {
                case "<":
                  $JSCompiler_StaticMethods_pcdata$$($handler$$10$$, "&lt;");
                  break;
                case ">":
                  $JSCompiler_StaticMethods_pcdata$$($handler$$10$$, "&gt;");
                  break;
                default:
                  $JSCompiler_StaticMethods_pcdata$$($handler$$10$$, "&amp;")
              }
            }
          }
        }
      }
    }
  }
  for($htmlLower_i$$inline_691$$ = $handler$$10$$.$stack_$.length;0 <= --$htmlLower_i$$inline_691$$;) {
    $handler$$10$$.$stringBuffer_$.append("</", $handler$$10$$.$stack_$[$htmlLower_i$$inline_691$$], ">")
  }
  $handler$$10$$.$stack_$.length = 0
};
$goog$string$html$HtmlParser$$.prototype.$lookupEntity_$ = function $$goog$string$html$HtmlParser$$$$$lookupEntity_$$($name$$70$$) {
  $name$$70$$ = $name$$70$$.toLowerCase();
  if($goog$string$html$HtmlParser$Entities$$.hasOwnProperty($name$$70$$)) {
    return $goog$string$html$HtmlParser$Entities$$[$name$$70$$]
  }
  var $m$$1$$ = $name$$70$$.match($goog$string$html$HtmlParser$DECIMAL_ESCAPE_RE_$$);
  return $m$$1$$ ? String.fromCharCode(parseInt($m$$1$$[1], 10)) : ($m$$1$$ = $name$$70$$.match($goog$string$html$HtmlParser$HEX_ESCAPE_RE_$$)) ? String.fromCharCode(parseInt($m$$1$$[1], 16)) : ""
};
function $goog$string$html$HtmlSaxHandler$$() {
}
;/*
 Portions of this code are from the google-caja project, received by
 Google under the Apache license (http://code.google.com/p/google-caja/).
 All other code is Copyright 2009 Google, Inc. All Rights Reserved.

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

*/
function $goog$string$html$HtmlSanitizer$$($stringBuffer$$1$$, $opt_urlPolicy$$1$$, $opt_nmTokenPolicy$$1$$) {
  this.$stringBuffer_$ = $stringBuffer$$1$$;
  this.$stack_$ = [];
  this.$ignoring_$ = $JSCompiler_alias_FALSE$$;
  this.$urlPolicy_$ = $opt_urlPolicy$$1$$;
  this.$nmTokenPolicy_$ = $opt_nmTokenPolicy$$1$$
}
$goog$inherits$$($goog$string$html$HtmlSanitizer$$, $goog$string$html$HtmlSaxHandler$$);
var $goog$string$html$HtmlSanitizer$Attributes$$ = {"*::class":9, "*::dir":0, "*::id":4, "*::lang":0, "*::onclick":2, "*::ondblclick":2, "*::onkeydown":2, "*::onkeypress":2, "*::onkeyup":2, "*::onload":2, "*::onmousedown":2, "*::onmousemove":2, "*::onmouseout":2, "*::onmouseover":2, "*::onmouseup":2, "*::style":3, "*::title":0, "*::accesskey":0, "*::tabindex":0, "*::onfocus":2, "*::onblur":2, "a::coords":0, "a::href":1, "a::hreflang":0, "a::name":7, "a::onblur":2, "a::rel":0, "a::rev":0, "a::shape":0,
"a::target":10, "a::type":0, "area::accesskey":0, "area::alt":0, "area::coords":0, "area::href":1, "area::nohref":0, "area::onfocus":2, "area::shape":0, "area::tabindex":0, "area::target":10, "bdo::dir":0, "blockquote::cite":1, "br::clear":0, "button::accesskey":0, "button::disabled":0, "button::name":8, "button::onblur":2, "button::onfocus":2, "button::tabindex":0, "button::type":0, "button::value":0, "caption::align":0, "col::align":0, "col::char":0, "col::charoff":0, "col::span":0, "col::valign":0,
"col::width":0, "colgroup::align":0, "colgroup::char":0, "colgroup::charoff":0, "colgroup::span":0, "colgroup::valign":0, "colgroup::width":0, "del::cite":1, "del::datetime":0, "dir::compact":0, "div::align":0, "dl::compact":0, "font::color":0, "font::face":0, "font::size":0, "form::accept":0, "form::action":1, "form::autocomplete":0, "form::enctype":0, "form::method":0, "form::name":7, "form::onreset":2, "form::onsubmit":2, "form::target":10, "h1::align":0, "h2::align":0, "h3::align":0, "h4::align":0,
"h5::align":0, "h6::align":0, "hr::align":0, "hr::noshade":0, "hr::size":0, "hr::width":0, "img::align":0, "img::alt":0, "img::border":0, "img::height":0, "img::hspace":0, "img::ismap":0, "img::longdesc":1, "img::name":7, "img::src":1, "img::usemap":11, "img::vspace":0, "img::width":0, "input::accept":0, "input::accesskey":0, "input::autocomplete":0, "input::align":0, "input::alt":0, "input::checked":0, "input::disabled":0, "input::ismap":0, "input::maxlength":0, "input::name":8, "input::onblur":2,
"input::onchange":2, "input::onfocus":2, "input::onselect":2, "input::readonly":0, "input::size":0, "input::src":1, "input::tabindex":0, "input::type":0, "input::usemap":11, "input::value":0, "ins::cite":1, "ins::datetime":0, "label::accesskey":0, "label::for":5, "label::onblur":2, "label::onfocus":2, "legend::accesskey":0, "legend::align":0, "li::type":0, "li::value":0, "map::name":7, "menu::compact":0, "ol::compact":0, "ol::start":0, "ol::type":0, "optgroup::disabled":0, "optgroup::label":0, "option::disabled":0,
"option::label":0, "option::selected":0, "option::value":0, "p::align":0, "pre::width":0, "q::cite":1, "select::disabled":0, "select::multiple":0, "select::name":8, "select::onblur":2, "select::onchange":2, "select::onfocus":2, "select::size":0, "select::tabindex":0, "table::align":0, "table::bgcolor":0, "table::border":0, "table::cellpadding":0, "table::cellspacing":0, "table::frame":0, "table::rules":0, "table::summary":0, "table::width":0, "tbody::align":0, "tbody::char":0, "tbody::charoff":0,
"tbody::valign":0, "td::abbr":0, "td::align":0, "td::axis":0, "td::bgcolor":0, "td::char":0, "td::charoff":0, "td::colspan":0, "td::headers":6, "td::height":0, "td::nowrap":0, "td::rowspan":0, "td::scope":0, "td::valign":0, "td::width":0, "textarea::accesskey":0, "textarea::cols":0, "textarea::disabled":0, "textarea::name":8, "textarea::onblur":2, "textarea::onchange":2, "textarea::onfocus":2, "textarea::onselect":2, "textarea::readonly":0, "textarea::rows":0, "textarea::tabindex":0, "tfoot::align":0,
"tfoot::char":0, "tfoot::charoff":0, "tfoot::valign":0, "th::abbr":0, "th::align":0, "th::axis":0, "th::bgcolor":0, "th::char":0, "th::charoff":0, "th::colspan":0, "th::headers":6, "th::height":0, "th::nowrap":0, "th::rowspan":0, "th::scope":0, "th::valign":0, "th::width":0, "thead::align":0, "thead::char":0, "thead::charoff":0, "thead::valign":0, "tr::align":0, "tr::bgcolor":0, "tr::char":0, "tr::charoff":0, "tr::valign":0, "ul::compact":0, "ul::type":0};
$goog$string$html$HtmlSanitizer$$.prototype.$startTag$ = function $$goog$string$html$HtmlSanitizer$$$$$startTag$$($tagName$$7$$, $attribs$$1$$) {
  if(!this.$ignoring_$ && $goog$string$html$HtmlParser$Elements$$.hasOwnProperty($tagName$$7$$)) {
    var $eflags$$1_i$$110$$ = $goog$string$html$HtmlParser$Elements$$[$tagName$$7$$];
    if(!($eflags$$1_i$$110$$ & 32)) {
      if($eflags$$1_i$$110$$ & 16) {
        this.$ignoring_$ = !($eflags$$1_i$$110$$ & 2)
      }else {
        for(var $attribs$$inline_695_n$$8$$ = $attribs$$1$$, $attribName$$1_i$$inline_696$$ = 0;$attribName$$1_i$$inline_696$$ < $attribs$$inline_695_n$$8$$.length;$attribName$$1_i$$inline_696$$ += 2) {
          var $attribName$$inline_697_value$$106$$ = $attribs$$inline_695_n$$8$$[$attribName$$1_i$$inline_696$$], $value$$inline_698$$ = $attribs$$inline_695_n$$8$$[$attribName$$1_i$$inline_696$$ + 1], $atype$$inline_699$$ = $JSCompiler_alias_NULL$$, $attribKey$$inline_700$$;
          if(($attribKey$$inline_700$$ = $tagName$$7$$ + "::" + $attribName$$inline_697_value$$106$$, $goog$string$html$HtmlSanitizer$Attributes$$.hasOwnProperty($attribKey$$inline_700$$)) || ($attribKey$$inline_700$$ = "*::" + $attribName$$inline_697_value$$106$$, $goog$string$html$HtmlSanitizer$Attributes$$.hasOwnProperty($attribKey$$inline_700$$))) {
            $atype$$inline_699$$ = $goog$string$html$HtmlSanitizer$Attributes$$[$attribKey$$inline_700$$]
          }
          if($atype$$inline_699$$ !== $JSCompiler_alias_NULL$$) {
            switch($atype$$inline_699$$) {
              case 0:
                break;
              case 2:
              ;
              case 3:
                $value$$inline_698$$ = $JSCompiler_alias_NULL$$;
                break;
              case 4:
              ;
              case 5:
              ;
              case 6:
              ;
              case 7:
              ;
              case 8:
              ;
              case 9:
                $value$$inline_698$$ = this.$nmTokenPolicy_$ ? this.$nmTokenPolicy_$($value$$inline_698$$) : $value$$inline_698$$;
                break;
              case 1:
                $value$$inline_698$$ = this.$urlPolicy_$ && this.$urlPolicy_$($value$$inline_698$$);
                break;
              case 11:
                $value$$inline_698$$ && "#" === $value$$inline_698$$.charAt(0) ? ($value$$inline_698$$ = this.$nmTokenPolicy_$ ? this.$nmTokenPolicy_$($value$$inline_698$$) : $value$$inline_698$$) && ($value$$inline_698$$ = "#" + $value$$inline_698$$) : $value$$inline_698$$ = $JSCompiler_alias_NULL$$;
                break;
              default:
                $value$$inline_698$$ = $JSCompiler_alias_NULL$$
            }
          }else {
            $value$$inline_698$$ = $JSCompiler_alias_NULL$$
          }
          $attribs$$inline_695_n$$8$$[$attribName$$1_i$$inline_696$$ + 1] = $value$$inline_698$$
        }
        if($attribs$$1$$ = $attribs$$inline_695_n$$8$$) {
          $eflags$$1_i$$110$$ & 2 || this.$stack_$.push($tagName$$7$$);
          this.$stringBuffer_$.append("<", $tagName$$7$$);
          $eflags$$1_i$$110$$ = 0;
          for($attribs$$inline_695_n$$8$$ = $attribs$$1$$.length;$eflags$$1_i$$110$$ < $attribs$$inline_695_n$$8$$;$eflags$$1_i$$110$$ += 2) {
            $attribName$$1_i$$inline_696$$ = $attribs$$1$$[$eflags$$1_i$$110$$], $attribName$$inline_697_value$$106$$ = $attribs$$1$$[$eflags$$1_i$$110$$ + 1], $attribName$$inline_697_value$$106$$ !== $JSCompiler_alias_NULL$$ && $attribName$$inline_697_value$$106$$ !== $JSCompiler_alias_VOID$$ && this.$stringBuffer_$.append(" ", $attribName$$1_i$$inline_696$$, '="', $attribName$$inline_697_value$$106$$.replace($goog$string$html$HtmlParser$AMP_RE_$$, "&amp;").replace($goog$string$html$HtmlParser$LT_RE_$$,
            "&lt;").replace($goog$string$html$HtmlParser$GT_RE_$$, "&gt;").replace($goog$string$html$HtmlParser$QUOTE_RE_$$, "&#34;").replace($goog$string$html$HtmlParser$EQUALS_RE_$$, "&#61;"), '"')
          }
          this.$stringBuffer_$.append(">")
        }
      }
    }
  }
};
$goog$string$html$HtmlSanitizer$$.prototype.$endTag$ = function $$goog$string$html$HtmlSanitizer$$$$$endTag$$($tagName$$8$$) {
  if(this.$ignoring_$) {
    this.$ignoring_$ = $JSCompiler_alias_FALSE$$
  }else {
    if($goog$string$html$HtmlParser$Elements$$.hasOwnProperty($tagName$$8$$)) {
      var $eflags$$2_index$$58$$ = $goog$string$html$HtmlParser$Elements$$[$tagName$$8$$];
      if(!($eflags$$2_index$$58$$ & 50)) {
        if($eflags$$2_index$$58$$ & 1) {
          for($eflags$$2_index$$58$$ = this.$stack_$.length;0 <= --$eflags$$2_index$$58$$;) {
            var $stackEl$$ = this.$stack_$[$eflags$$2_index$$58$$];
            if($stackEl$$ === $tagName$$8$$) {
              break
            }
            if(!($goog$string$html$HtmlParser$Elements$$[$stackEl$$] & 1)) {
              return
            }
          }
        }else {
          for($eflags$$2_index$$58$$ = this.$stack_$.length;0 <= --$eflags$$2_index$$58$$ && this.$stack_$[$eflags$$2_index$$58$$] !== $tagName$$8$$;) {
          }
        }
        if(!(0 > $eflags$$2_index$$58$$)) {
          for(var $i$$111$$ = this.$stack_$.length;--$i$$111$$ > $eflags$$2_index$$58$$;) {
            $stackEl$$ = this.$stack_$[$i$$111$$], $goog$string$html$HtmlParser$Elements$$[$stackEl$$] & 1 || this.$stringBuffer_$.append("</", $stackEl$$, ">")
          }
          this.$stack_$.length = $eflags$$2_index$$58$$;
          this.$stringBuffer_$.append("</", $tagName$$8$$, ">")
        }
      }
    }
  }
};
function $JSCompiler_StaticMethods_pcdata$$($JSCompiler_StaticMethods_pcdata$self$$, $text$$16$$) {
  $JSCompiler_StaticMethods_pcdata$self$$.$ignoring_$ || $JSCompiler_StaticMethods_pcdata$self$$.$stringBuffer_$.append($text$$16$$)
}
$goog$string$html$HtmlSanitizer$$.prototype.$rcdata$ = function $$goog$string$html$HtmlSanitizer$$$$$rcdata$$($text$$17$$) {
  this.$ignoring_$ || this.$stringBuffer_$.append($text$$17$$)
};
$goog$string$html$HtmlSanitizer$$.prototype.$cdata$ = function $$goog$string$html$HtmlSanitizer$$$$$cdata$$($text$$18$$) {
  this.$ignoring_$ || this.$stringBuffer_$.append($text$$18$$)
};
function $annotorious$templates$popup$$() {
  return'<div class="annotorious-popup top-left" style="position:absolute;z-index:1"><div class="annotorious-popup-buttons"><a class="annotorious-popup-button annotorious-popup-button-edit" title="Edit" href="javascript:void(0);">EDIT</a><a class="annotorious-popup-button annotorious-popup-button-delete" title="Delete" href="javascript:void(0);">DELETE</a></div><span class="annotorious-popup-text"></span></div>'
}
function $annotorious$templates$editform$$() {
  return'<div class="annotorious-editor" style="position:absolute;z-index:1"><form><textarea class="annotorious-editor-text" placeholder="Add a Comment..." tabindex="1"></textarea><div class="annotorious-editor-button-container"><a class="annotorious-editor-button annotorious-editor-button-cancel" href="javascript:void(0);" tabindex="3">Cancel</a><a class="annotorious-editor-button annotorious-editor-button-save" href="javascript:void(0);" tabindex="2">Save</a></div></form></div>'
}
;function $annotorious$editor$Editor$$($annotator$$24$$) {
  function $opt_callback$$inline_711$$() {
    var $JSCompiler_StaticMethods_resize$self$$inline_708$$ = $self$$14$$.$_textarea$;
    $JSCompiler_StaticMethods_resize$self$$inline_708$$.$getElement$() && $JSCompiler_StaticMethods_resize$self$$inline_708$$.$grow_$()
  }
  this.element = $goog$soy$renderAsElement$$($annotorious$templates$editform$$);
  this.$_annotator$ = $annotator$$24$$;
  this.$_item$ = $annotator$$24$$.getItem();
  this.$_textarea$ = new $goog$ui$Textarea$$("");
  this.$_btnCancel$ = $query$$inline_152$$(".annotorious-editor-button-cancel", this.element)[0];
  this.$_btnSave$ = $query$$inline_152$$(".annotorious-editor-button-save", this.element)[0];
  var $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$;
  $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$ = this.$_btnSave$;
  $goog$dom$BrowserFeature$CAN_USE_PARENT_ELEMENT_PROPERTY$$ ? $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$ = $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$.parentElement : ($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$ = $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$.parentNode,
  $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$ = $goog$dom$isElement$$($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$) ? $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$ : $JSCompiler_alias_NULL$$);
  this.$_btnContainer$ = $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$;
  this.$_extraFields$ = [];
  var $self$$14$$ = this;
  $goog$events$listen$$(this.$_btnCancel$, "click", function($event$$15$$) {
    $event$$15$$.preventDefault();
    $annotator$$24$$.stopSelection($self$$14$$.$_original_annotation$);
    $self$$14$$.close()
  });
  $goog$events$listen$$(this.$_btnSave$, "click", function($annotation$$14_event$$16$$) {
    $annotation$$14_event$$16$$.preventDefault();
    $annotation$$14_event$$16$$ = $self$$14$$.$getAnnotation$();
    $annotator$$24$$.$addAnnotation$($annotation$$14_event$$16$$);
    $annotator$$24$$.stopSelection();
    $self$$14$$.$_original_annotation$ ? $annotator$$24$$.fireEvent("onAnnotationUpdated", $annotation$$14_event$$16$$) : $annotator$$24$$.fireEvent("onAnnotationCreated", $annotation$$14_event$$16$$);
    $self$$14$$.close()
  });
  $goog$style$showElement$$(this.element, $JSCompiler_alias_FALSE$$);
  $annotator$$24$$.element.appendChild(this.element);
  this.$_textarea$.$decorate$($query$$inline_152$$(".annotorious-editor-text", this.element)[0]);
  var $div$$inline_710$$ = this.element;
  $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$ = document.createElement("div");
  $goog$style$setStyle$$($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$, "position", "absolute");
  $goog$style$setStyle$$($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$, "top", "0px");
  $goog$style$setStyle$$($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$, "right", "0px");
  $goog$style$setStyle$$($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$, "width", "5px");
  $goog$style$setStyle$$($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$, "height", "100%");
  $goog$style$setStyle$$($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$, "cursor", "e-resize");
  $div$$inline_710$$.appendChild($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$);
  var $div_border$$inline_713_width_limit$$inline_714$$ = $goog$style$getBorderBox$$($div$$inline_710$$), $div_border$$inline_713_width_limit$$inline_714$$ = $goog$style$getBounds$$($div$$inline_710$$).width - $div_border$$inline_713_width_limit$$inline_714$$.right - $div_border$$inline_713_width_limit$$inline_714$$.left;
  $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$ = new $goog$fx$Dragger$$($JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$);
  $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$.$limits$ = new $goog$math$Rect$$($div_border$$inline_713_width_limit$$inline_714$$, 0, 800, 0) || new $goog$math$Rect$$(NaN, NaN, NaN, NaN);
  $JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$.$defaultAction$ = function $$JSCompiler_inline_result$$24_dragger$$inline_715_element$$inline_702_handle$$inline_712_parent$$inline_703$$$$defaultAction$$($x$$inline_716$$) {
    $goog$style$setStyle$$($div$$inline_710$$, "width", $x$$inline_716$$ + "px");
    $opt_callback$$inline_711$$ && $opt_callback$$inline_711$$()
  }
}
$JSCompiler_prototypeAlias$$ = $annotorious$editor$Editor$$.prototype;
$JSCompiler_prototypeAlias$$.$addField$ = function $$JSCompiler_prototypeAlias$$$$addField$$($field$$2_refNode$$inline_722$$) {
  var $fieldEl$$1$$ = $goog$dom$createDom$$("div", "annotorious-editor-field");
  $goog$isString$$($field$$2_refNode$$inline_722$$) ? $fieldEl$$1$$.innerHTML = $field$$2_refNode$$inline_722$$ : $goog$isFunction$$($field$$2_refNode$$inline_722$$) ? this.$_extraFields$.push({$el$:$fieldEl$$1$$, $fn$:$field$$2_refNode$$inline_722$$}) : $goog$dom$isElement$$($field$$2_refNode$$inline_722$$) && $fieldEl$$1$$.appendChild($field$$2_refNode$$inline_722$$);
  $field$$2_refNode$$inline_722$$ = this.$_btnContainer$;
  $field$$2_refNode$$inline_722$$.parentNode && $field$$2_refNode$$inline_722$$.parentNode.insertBefore($fieldEl$$1$$, $field$$2_refNode$$inline_722$$)
};
$JSCompiler_prototypeAlias$$.open = function $$JSCompiler_prototypeAlias$$$open$($opt_annotation$$1$$) {
  (this.$_current_annotation$ = this.$_original_annotation$ = $opt_annotation$$1$$) && this.$_textarea$.$setContent$(String($opt_annotation$$1$$.text));
  $goog$style$showElement$$(this.element, $JSCompiler_alias_TRUE$$);
  this.$_textarea$.$getElement$().focus();
  $goog$array$forEach$$(this.$_extraFields$, function($field$$3$$) {
    var $f$$46$$ = $field$$3$$.$fn$($opt_annotation$$1$$);
    $goog$isString$$($f$$46$$) ? $field$$3$$.$el$.innerHTML = $f$$46$$ : $goog$dom$isElement$$($f$$46$$) && ($goog$dom$removeChildren$$($field$$3$$.$el$), $field$$3$$.$el$.appendChild($f$$46$$))
  })
};
$JSCompiler_prototypeAlias$$.close = function $$JSCompiler_prototypeAlias$$$close$() {
  $goog$style$showElement$$(this.element, $JSCompiler_alias_FALSE$$);
  this.$_textarea$.$setContent$("")
};
$JSCompiler_prototypeAlias$$.$setPosition$ = function $$JSCompiler_prototypeAlias$$$$setPosition$$($xy$$3$$) {
  $goog$style$setPosition$$(this.element, $xy$$3$$.x, $xy$$3$$.y)
};
$JSCompiler_prototypeAlias$$.$getAnnotation$ = function $$JSCompiler_prototypeAlias$$$$getAnnotation$$() {
  var $htmlText$$inline_733_sanitized$$;
  $htmlText$$inline_733_sanitized$$ = this.$_textarea$.$getElement$().value;
  var $stringBuffer$$inline_736$$ = new $goog$string$StringBuffer$$;
  (new $goog$string$html$HtmlParser$$).parse(new $goog$string$html$HtmlSanitizer$$($stringBuffer$$inline_736$$, function($url$$21$$) {
    return $url$$21$$
  }, $JSCompiler_alias_VOID$$), $htmlText$$inline_733_sanitized$$);
  $htmlText$$inline_733_sanitized$$ = $stringBuffer$$inline_736$$.toString();
  this.$_current_annotation$ ? this.$_current_annotation$.text = $htmlText$$inline_733_sanitized$$ : this.$_current_annotation$ = new $annotorious$annotation$Annotation$$(this.$_item$.src, $htmlText$$inline_733_sanitized$$, this.$_annotator$.$getActiveSelector$().getShape());
  return this.$_current_annotation$
};
$annotorious$editor$Editor$$.prototype.addField = $annotorious$editor$Editor$$.prototype.$addField$;
$annotorious$editor$Editor$$.prototype.getAnnotation = $annotorious$editor$Editor$$.prototype.$getAnnotation$;
function $annotorious$hint$Hint$$($annotator$$25$$, $parent$$25$$, $opt_msg$$1$$) {
  var $self$$15$$ = this;
  $opt_msg$$1$$ || ($opt_msg$$1$$ = "Login to annotate");
  this.element = $goog$soy$renderAsElement$$($annotorious$templates$image$hint$$, {$msg$:$opt_msg$$1$$});
  this.$_annotator$ = $annotator$$25$$;
  this.$_message$ = $query$$inline_152$$(".annotorious-hint-msg", this.element)[0];
  this.$_icon$ = $query$$inline_152$$(".annotorious-hint-icon", this.element)[0];
  this.$_overItemHandler$ = function $this$$_overItemHandler$$() {
    $self$$15$$.show()
  };
  this.$_outOfItemHandler$ = function $this$$_outOfItemHandler$$() {
    $JSCompiler_StaticMethods_hide$$($self$$15$$)
  };
  this.$_attachListeners$();
  $JSCompiler_StaticMethods_hide$$(this);
  $parent$$25$$.appendChild(this.element)
}
$annotorious$hint$Hint$$.prototype.$_attachListeners$ = function $$annotorious$hint$Hint$$$$$_attachListeners$$() {
  var $self$$16$$ = this;
  this.$_mouseOverListener$ = $goog$events$listen$$(this.$_icon$, "mouseover", function() {
    $self$$16$$.show();
    window.clearTimeout($self$$16$$.$_hideTimer$)
  });
  this.$_mouseOutListener$ = $goog$events$listen$$(this.$_icon$, "mouseout", function() {
    $JSCompiler_StaticMethods_hide$$($self$$16$$)
  });
  this.$_annotator$.$addHandler$("onMouseOverItem", this.$_overItemHandler$);
  this.$_annotator$.$addHandler$("onMouseOutOfItem", this.$_outOfItemHandler$)
};
$annotorious$hint$Hint$$.prototype.$_detachListeners$ = function $$annotorious$hint$Hint$$$$$_detachListeners$$() {
  $goog$events$unlistenByKey$$(this.$_mouseOverListener$);
  $goog$events$unlistenByKey$$(this.$_mouseOutListener$);
  this.$_annotator$.$removeHandler$("onMouseOverItem", this.$_overItemHandler$);
  this.$_annotator$.$removeHandler$("onMouseOutOfItem", this.$_outOfItemHandler$)
};
$annotorious$hint$Hint$$.prototype.show = function $$annotorious$hint$Hint$$$$show$() {
  window.clearTimeout(this.$_hideTimer$);
  $goog$style$setOpacity$$(this.$_message$, 0.8);
  var $self$$17$$ = this;
  this.$_hideTimer$ = window.setTimeout(function() {
    $JSCompiler_StaticMethods_hide$$($self$$17$$)
  }, 3E3)
};
function $JSCompiler_StaticMethods_hide$$($JSCompiler_StaticMethods_hide$self$$) {
  window.clearTimeout($JSCompiler_StaticMethods_hide$self$$.$_hideTimer$);
  $goog$style$setOpacity$$($JSCompiler_StaticMethods_hide$self$$.$_message$, 0)
}
$annotorious$hint$Hint$$.prototype.$destroy$ = function $$annotorious$hint$Hint$$$$$destroy$$() {
  this.$_detachListeners$();
  delete this.$_mouseOverListener$;
  delete this.$_mouseOutListener$;
  delete this.$_overItemHandler$;
  delete this.$_outOfItemHandler$;
  $goog$dom$removeNode$$(this.element)
};
var $hasTouch$$ = "ontouchstart" in window, $annotorious$humanEvents$MOVE$$ = $hasTouch$$ ? "touchmove" : "mousemove", $annotorious$humanEvents$UP$$ = $hasTouch$$ ? "touchend" : "mouseup";
$hasTouch$$ && $goog$dom$classes$add$$(document.getElementsByTagName("html")[0], "hasTouch");
function $annotorious$plugins$selection$RectDragSelector$$() {
}
$JSCompiler_prototypeAlias$$ = $annotorious$plugins$selection$RectDragSelector$$.prototype;
$JSCompiler_prototypeAlias$$.init = function $$JSCompiler_prototypeAlias$$$init$($canvas$$1$$, $annotator$$26$$) {
  this.$_canvas$ = $canvas$$1$$;
  this.$_annotator$ = $annotator$$26$$;
  this.$_g2d$ = $canvas$$1$$.getContext("2d");
  this.$_g2d$.lineWidth = 1;
  this.$_enabled$ = $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.$_attachListeners$ = function $$JSCompiler_prototypeAlias$$$$_attachListeners$$() {
  var $self$$18$$ = this, $canvas$$2$$ = this.$_canvas$;
  this.$_mouseMoveListener$ = $goog$events$listen$$(this.$_canvas$, $annotorious$humanEvents$MOVE$$, function($event$$19_points$$9_width$$20$$) {
    $event$$19_points$$9_width$$20$$ = $annotorious$events$sanitizeCoordinates$$($event$$19_points$$9_width$$20$$, $canvas$$2$$);
    if($self$$18$$.$_enabled$) {
      $self$$18$$.$_opposite$ = {x:$event$$19_points$$9_width$$20$$.x, y:$event$$19_points$$9_width$$20$$.y};
      $self$$18$$.$_g2d$.clearRect(0, 0, $canvas$$2$$.width, $canvas$$2$$.height);
      var $event$$19_points$$9_width$$20$$ = $self$$18$$.$_opposite$.x - $self$$18$$.$_anchor$.x, $height$$25$$ = $self$$18$$.$_opposite$.y - $self$$18$$.$_anchor$.y;
      $self$$18$$.$_g2d$.strokeStyle = "#000000";
      $self$$18$$.$_g2d$.strokeRect($self$$18$$.$_anchor$.x + 0.5, $self$$18$$.$_anchor$.y + 0.5, $event$$19_points$$9_width$$20$$, $height$$25$$);
      $self$$18$$.$_g2d$.strokeStyle = "#ffffff";
      0 < $event$$19_points$$9_width$$20$$ && 0 < $height$$25$$ ? $self$$18$$.$_g2d$.strokeRect($self$$18$$.$_anchor$.x + 1.5, $self$$18$$.$_anchor$.y + 1.5, $event$$19_points$$9_width$$20$$ - 2, $height$$25$$ - 2) : 0 < $event$$19_points$$9_width$$20$$ && 0 > $height$$25$$ ? $self$$18$$.$_g2d$.strokeRect($self$$18$$.$_anchor$.x + 1.5, $self$$18$$.$_anchor$.y - 0.5, $event$$19_points$$9_width$$20$$ - 2, $height$$25$$ + 2) : 0 > $event$$19_points$$9_width$$20$$ && 0 > $height$$25$$ ? $self$$18$$.$_g2d$.strokeRect($self$$18$$.$_anchor$.x -
      0.5, $self$$18$$.$_anchor$.y - 0.5, $event$$19_points$$9_width$$20$$ + 2, $height$$25$$ + 2) : $self$$18$$.$_g2d$.strokeRect($self$$18$$.$_anchor$.x - 0.5, $self$$18$$.$_anchor$.y + 1.5, $event$$19_points$$9_width$$20$$ + 2, $height$$25$$ - 2)
    }
  });
  this.$_mouseUpListener$ = $goog$events$listen$$($canvas$$2$$, $annotorious$humanEvents$UP$$, function($annotations$$2_event$$20$$) {
    var $points$$10$$ = $annotorious$events$sanitizeCoordinates$$($annotations$$2_event$$20$$, $canvas$$2$$), $shape$$11$$ = $self$$18$$.getShape(), $annotations$$2_event$$20$$ = $annotations$$2_event$$20$$.$event_$ ? $annotations$$2_event$$20$$.$event_$ : $annotations$$2_event$$20$$;
    $self$$18$$.$_enabled$ = $JSCompiler_alias_FALSE$$;
    $shape$$11$$ ? $self$$18$$.$_annotator$.fireEvent("onSelectionCompleted", {mouseEvent:$annotations$$2_event$$20$$, shape:$shape$$11$$, viewportBounds:$self$$18$$.getViewportBounds()}) : ($self$$18$$.$_annotator$.fireEvent("onSelectionCanceled"), $hasTouch$$ && ($annotations$$2_event$$20$$ = $self$$18$$.$_annotator$.$getAnnotationsAt$($points$$10$$.x, $points$$10$$.y), 0 < $annotations$$2_event$$20$$.length && $self$$18$$.$_annotator$.$highlightAnnotation$($annotations$$2_event$$20$$[0])))
  })
};
$JSCompiler_prototypeAlias$$.$_detachListeners$ = function $$JSCompiler_prototypeAlias$$$$_detachListeners$$() {
  this.$_mouseMoveListener$ && ($goog$events$unlistenByKey$$(this.$_mouseMoveListener$), delete this.$_mouseMoveListener$);
  this.$_mouseUpListener$ && ($goog$events$unlistenByKey$$(this.$_mouseUpListener$), delete this.$_mouseUpListener$)
};
$JSCompiler_prototypeAlias$$.getName = $JSCompiler_returnArg$$("rect_drag");
$JSCompiler_prototypeAlias$$.getSupportedShapeType = $JSCompiler_returnArg$$("rect");
$JSCompiler_prototypeAlias$$.startSelection = function $$JSCompiler_prototypeAlias$$$startSelection$($x$$82$$, $y$$49$$) {
  var $startPoint$$2$$ = {x:$x$$82$$, y:$y$$49$$};
  this.$_enabled$ = $JSCompiler_alias_TRUE$$;
  this.$_attachListeners$($startPoint$$2$$);
  this.$_anchor$ = new $annotorious$shape$geom$Point$$($x$$82$$, $y$$49$$);
  this.$_annotator$.fireEvent("onSelectionStarted", {offsetX:$x$$82$$, offsetY:$y$$49$$});
  $goog$style$setStyle$$(document.body, "-webkit-user-select", "none")
};
$JSCompiler_prototypeAlias$$.stopSelection = function $$JSCompiler_prototypeAlias$$$stopSelection$() {
  this.$_detachListeners$();
  this.$_g2d$.clearRect(0, 0, this.$_canvas$.width, this.$_canvas$.height);
  $goog$style$setStyle$$(document.body, "-webkit-user-select", "auto");
  delete this.$_opposite$
};
$JSCompiler_prototypeAlias$$.getShape = function $$JSCompiler_prototypeAlias$$$getShape$() {
  if(this.$_opposite$ && 3 < Math.abs(this.$_opposite$.x - this.$_anchor$.x) && 3 < Math.abs(this.$_opposite$.y - this.$_anchor$.y)) {
    var $item_opposite_viewportBounds$$ = this.getViewportBounds(), $item_anchor$$ = this.$_annotator$.$toItemCoordinates$({x:$item_opposite_viewportBounds$$.left, y:$item_opposite_viewportBounds$$.top}), $item_opposite_viewportBounds$$ = this.$_annotator$.$toItemCoordinates$({x:$item_opposite_viewportBounds$$.right - 1, y:$item_opposite_viewportBounds$$.bottom - 1});
    return new $annotorious$shape$Shape$$("rect", new $annotorious$shape$geom$Rectangle$$($item_anchor$$.x, $item_anchor$$.y, $item_opposite_viewportBounds$$.x - $item_anchor$$.x, $item_opposite_viewportBounds$$.y - $item_anchor$$.y))
  }
};
$JSCompiler_prototypeAlias$$.getViewportBounds = function $$JSCompiler_prototypeAlias$$$getViewportBounds$() {
  var $right$$12$$, $left$$14$$;
  this.$_opposite$.x > this.$_anchor$.x ? ($right$$12$$ = this.$_opposite$.x, $left$$14$$ = this.$_anchor$.x) : ($right$$12$$ = this.$_anchor$.x, $left$$14$$ = this.$_opposite$.x);
  var $top$$12$$, $bottom$$8$$;
  this.$_opposite$.y > this.$_anchor$.y ? ($top$$12$$ = this.$_anchor$.y, $bottom$$8$$ = this.$_opposite$.y) : ($top$$12$$ = this.$_opposite$.y, $bottom$$8$$ = this.$_anchor$.y);
  return{top:$top$$12$$, right:$right$$12$$, bottom:$bottom$$8$$, left:$left$$14$$}
};
$JSCompiler_prototypeAlias$$.drawShape = function $$JSCompiler_prototypeAlias$$$drawShape$($g2d$$, $geom$$1_shape$$12$$, $color$$2_highlight$$2$$) {
  if("rect" == $geom$$1_shape$$12$$.type) {
    var $lineWidth$$;
    $color$$2_highlight$$2$$ ? ($color$$2_highlight$$2$$ = "#fff000", $lineWidth$$ = 1.2) : ($color$$2_highlight$$2$$ = "#ffffff", $lineWidth$$ = 1);
    $geom$$1_shape$$12$$ = $geom$$1_shape$$12$$.geometry;
    $g2d$$.strokeStyle = "#000000";
    $g2d$$.lineWidth = $lineWidth$$;
    $g2d$$.strokeRect($geom$$1_shape$$12$$.x + 0.5, $geom$$1_shape$$12$$.y + 0.5, $geom$$1_shape$$12$$.width + 1, $geom$$1_shape$$12$$.height + 1);
    $g2d$$.strokeStyle = $color$$2_highlight$$2$$;
    $g2d$$.strokeRect($geom$$1_shape$$12$$.x + 1.5, $geom$$1_shape$$12$$.y + 1.5, $geom$$1_shape$$12$$.width - 1, $geom$$1_shape$$12$$.height - 1)
  }
};
function $annotorious$modules$image$ImageAnnotator$$($item$$6$$, $opt_popup$$) {
  function $transferMargin$$inline_743$$($direction$$inline_746$$, $value$$inline_747$$) {
    $goog$style$setStyle$$($annotationLayer$$inline_742$$, "margin-" + $direction$$inline_746$$, $value$$inline_747$$ + "px");
    $goog$style$setStyle$$($item$$6$$, "margin-" + $direction$$inline_746$$, 0);
    $goog$style$setStyle$$($item$$6$$, "padding-" + $direction$$inline_746$$, 0)
  }
  this.$_image$ = $item$$6$$;
  this.$_original_bufferspace$ = {padding:$item$$6$$.style.padding, margin:$item$$6$$.style.margin};
  this.$_eventBroker$ = new $annotorious$events$EventBroker$$;
  this.$_selectors$ = [];
  this.$_selectionEnabled$ = $JSCompiler_alias_TRUE$$;
  this.element = $goog$dom$createDom$$("div", "annotorious-annotationlayer");
  $goog$style$setStyle$$(this.element, "position", "relative");
  $goog$style$setStyle$$(this.element, "display", "inline-block");
  var $annotationLayer$$inline_742$$ = this.element, $default_selector_img_bounds_margin$$inline_744$$ = $goog$style$getBox_$$($item$$6$$, "margin"), $padding$$inline_745$$ = $goog$style$getBox_$$($item$$6$$, "padding");
  (0 != $default_selector_img_bounds_margin$$inline_744$$.top || 0 != $padding$$inline_745$$.top) && $transferMargin$$inline_743$$("top", $default_selector_img_bounds_margin$$inline_744$$.top + $padding$$inline_745$$.top);
  (0 != $default_selector_img_bounds_margin$$inline_744$$.right || 0 != $padding$$inline_745$$.right) && $transferMargin$$inline_743$$("right", $default_selector_img_bounds_margin$$inline_744$$.right + $padding$$inline_745$$.right);
  (0 != $default_selector_img_bounds_margin$$inline_744$$.bottom || 0 != $padding$$inline_745$$.bottom) && $transferMargin$$inline_743$$("bottom", $default_selector_img_bounds_margin$$inline_744$$.bottom + $padding$$inline_745$$.bottom);
  (0 != $default_selector_img_bounds_margin$$inline_744$$.left || 0 != $padding$$inline_745$$.left) && $transferMargin$$inline_743$$("left", $default_selector_img_bounds_margin$$inline_744$$.left + $padding$$inline_745$$.left);
  $default_selector_img_bounds_margin$$inline_744$$ = $goog$style$getBounds$$($item$$6$$);
  $goog$style$setSize$$(this.element, $default_selector_img_bounds_margin$$inline_744$$.width, $default_selector_img_bounds_margin$$inline_744$$.height);
  $goog$dom$replaceNode$$(this.element, $item$$6$$);
  this.element.appendChild($item$$6$$);
  this.$_viewCanvas$ = $goog$soy$renderAsElement$$($annotorious$templates$image$canvas$$, {width:$default_selector_img_bounds_margin$$inline_744$$.width, height:$default_selector_img_bounds_margin$$inline_744$$.height});
  $goog$dom$classes$add$$(this.$_viewCanvas$, "annotorious-item-unfocus");
  this.element.appendChild(this.$_viewCanvas$);
  this.$_editCanvas$ = $goog$soy$renderAsElement$$($annotorious$templates$image$canvas$$, {width:$default_selector_img_bounds_margin$$inline_744$$.width, height:$default_selector_img_bounds_margin$$inline_744$$.height});
  $goog$style$showElement$$(this.$_editCanvas$, $JSCompiler_alias_FALSE$$);
  this.element.appendChild(this.$_editCanvas$);
  this.popup = $opt_popup$$ ? $opt_popup$$ : new $annotorious$viewer$Popup$$(this);
  $default_selector_img_bounds_margin$$inline_744$$ = new $annotorious$plugins$selection$RectDragSelector$$;
  $default_selector_img_bounds_margin$$inline_744$$.init(this.$_editCanvas$, this);
  this.$_selectors$.push($default_selector_img_bounds_margin$$inline_744$$);
  this.$_currentSelector$ = $default_selector_img_bounds_margin$$inline_744$$;
  this.editor = new $annotorious$editor$Editor$$(this);
  this.$_viewer$ = new $annotorious$modules$image$Viewer$$(this.$_viewCanvas$, this.popup, this);
  this.$_hint$ = new $annotorious$hint$Hint$$(this, this.element);
  var $self$$19$$ = this;
  $goog$events$listen$$(this.element, "mouseover", function($event$$21_relatedTarget$$1$$) {
    $event$$21_relatedTarget$$1$$ = $event$$21_relatedTarget$$1$$.relatedTarget;
    if(!$event$$21_relatedTarget$$1$$ || !$goog$dom$contains$$($self$$19$$.element, $event$$21_relatedTarget$$1$$)) {
      $self$$19$$.$_eventBroker$.fireEvent("onMouseOverItem"), $goog$dom$classes$addRemove$$($self$$19$$.$_viewCanvas$, "annotorious-item-unfocus", "annotorious-item-focus")
    }
  });
  $goog$events$listen$$(this.element, "mouseout", function($event$$22_relatedTarget$$2$$) {
    $event$$22_relatedTarget$$2$$ = $event$$22_relatedTarget$$2$$.relatedTarget;
    if(!$event$$22_relatedTarget$$2$$ || !$goog$dom$contains$$($self$$19$$.element, $event$$22_relatedTarget$$2$$)) {
      $self$$19$$.$_eventBroker$.fireEvent("onMouseOutOfItem"), $goog$dom$classes$addRemove$$($self$$19$$.$_viewCanvas$, "annotorious-item-focus", "annotorious-item-unfocus")
    }
  });
  $goog$events$listen$$(this.$_viewCanvas$, "mousedown", function($event$$23$$) {
    $self$$19$$.$_selectionEnabled$ && ($goog$style$showElement$$($self$$19$$.$_editCanvas$, $JSCompiler_alias_TRUE$$), $self$$19$$.$_viewer$.$highlightAnnotation$($JSCompiler_alias_VOID$$), $self$$19$$.$_currentSelector$.startSelection($event$$23$$.offsetX, $event$$23$$.offsetY))
  });
  this.$_eventBroker$.$addHandler$("onSelectionCompleted", function($bounds_event$$24$$) {
    $bounds_event$$24$$ = $bounds_event$$24$$.viewportBounds;
    $self$$19$$.editor.$setPosition$(new $annotorious$shape$geom$Point$$($bounds_event$$24$$.left + $self$$19$$.$_image$.offsetLeft, $bounds_event$$24$$.bottom + 4 + $self$$19$$.$_image$.offsetTop));
    $self$$19$$.editor.open()
  });
  this.$_eventBroker$.$addHandler$("onSelectionCanceled", function() {
    $goog$style$showElement$$($self$$19$$.$_editCanvas$, $JSCompiler_alias_FALSE$$);
    $self$$19$$.$_currentSelector$.stopSelection()
  })
}
$JSCompiler_prototypeAlias$$ = $annotorious$modules$image$ImageAnnotator$$.prototype;
$JSCompiler_prototypeAlias$$.$activateSelector$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$addAnnotation$ = function $$JSCompiler_prototypeAlias$$$$addAnnotation$$($annotation$$15$$, $opt_replace$$3$$) {
  this.$_viewer$.$addAnnotation$($annotation$$15$$, $opt_replace$$3$$)
};
$JSCompiler_prototypeAlias$$.$addHandler$ = function $$JSCompiler_prototypeAlias$$$$addHandler$$($type$$84$$, $handler$$12$$) {
  this.$_eventBroker$.$addHandler$($type$$84$$, $handler$$12$$)
};
$JSCompiler_prototypeAlias$$.$addSelector$ = function $$JSCompiler_prototypeAlias$$$$addSelector$$($selector$$7$$) {
  $selector$$7$$.init(this, this.$_editCanvas$);
  this.$_selectors$.push($selector$$7$$)
};
$JSCompiler_prototypeAlias$$.$destroy$ = function $$JSCompiler_prototypeAlias$$$$destroy$$() {
  var $img$$2$$ = this.$_image$;
  $img$$2$$.style.margin = this.$_original_bufferspace$.margin;
  $img$$2$$.style.padding = this.$_original_bufferspace$.padding;
  $goog$dom$replaceNode$$($img$$2$$, this.element)
};
$JSCompiler_prototypeAlias$$.$editAnnotation$ = function $$JSCompiler_prototypeAlias$$$$editAnnotation$$($annotation$$16$$) {
  this.$_viewer$.$removeAnnotation$($annotation$$16$$);
  var $anchor$$1_bounds$$1_selector$$8$$ = $goog$array$find$$(this.$_selectors$, function($selector$$9$$) {
    return $selector$$9$$.getSupportedShapeType() == $annotation$$16$$.shapes[0].type
  });
  if($anchor$$1_bounds$$1_selector$$8$$) {
    $goog$style$showElement$$(this.$_editCanvas$, $JSCompiler_alias_TRUE$$);
    this.$_viewer$.$highlightAnnotation$($JSCompiler_alias_VOID$$);
    var $g2d$$1$$ = this.$_editCanvas$.getContext("2d"), $shape$$13_viewportShape$$1$$ = $annotation$$16$$.shapes[0], $self$$20$$ = this, $shape$$13_viewportShape$$1$$ = "pixel" == $shape$$13_viewportShape$$1$$.units ? $shape$$13_viewportShape$$1$$ : $annotorious$shape$transform$$($shape$$13_viewportShape$$1$$, function($xy$$4$$) {
      return $self$$20$$.$fromItemCoordinates$($xy$$4$$)
    });
    $anchor$$1_bounds$$1_selector$$8$$.drawShape($g2d$$1$$, $shape$$13_viewportShape$$1$$)
  }
  $anchor$$1_bounds$$1_selector$$8$$ = $annotorious$shape$getBoundingRect$$($annotation$$16$$.shapes[0]).geometry;
  $anchor$$1_bounds$$1_selector$$8$$ = "pixel" == $annotation$$16$$.shapes[0].units ? new $annotorious$shape$geom$Point$$($anchor$$1_bounds$$1_selector$$8$$.x, $anchor$$1_bounds$$1_selector$$8$$.y + $anchor$$1_bounds$$1_selector$$8$$.height) : this.$fromItemCoordinates$(new $annotorious$shape$geom$Point$$($anchor$$1_bounds$$1_selector$$8$$.x, $anchor$$1_bounds$$1_selector$$8$$.y + $anchor$$1_bounds$$1_selector$$8$$.height));
  this.editor.$setPosition$(new $annotorious$shape$geom$Point$$($anchor$$1_bounds$$1_selector$$8$$.x + this.$_image$.offsetLeft, $anchor$$1_bounds$$1_selector$$8$$.y + 4 + this.$_image$.offsetTop));
  this.editor.open($annotation$$16$$)
};
$JSCompiler_prototypeAlias$$.fireEvent = function $$JSCompiler_prototypeAlias$$$fireEvent$($type$$85$$, $event$$25$$) {
  return this.$_eventBroker$.fireEvent($type$$85$$, $event$$25$$)
};
$JSCompiler_prototypeAlias$$.$fromItemCoordinates$ = function $$JSCompiler_prototypeAlias$$$$fromItemCoordinates$$($xy$$5$$) {
  var $imgSize$$ = $goog$style$getSize$$(this.$_image$);
  return{x:$xy$$5$$.x * $imgSize$$.width, y:$xy$$5$$.y * $imgSize$$.height}
};
$JSCompiler_prototypeAlias$$.$getActiveSelector$ = $JSCompiler_get$$("$_currentSelector$");
$JSCompiler_prototypeAlias$$.$getAnnotations$ = function $$JSCompiler_prototypeAlias$$$$getAnnotations$$() {
  return this.$_viewer$.$getAnnotations$()
};
$JSCompiler_prototypeAlias$$.$getAnnotationsAt$ = function $$JSCompiler_prototypeAlias$$$$getAnnotationsAt$$($cx$$, $cy$$) {
  return $goog$array$toArray$$(this.$_viewer$.$getAnnotationsAt$($cx$$, $cy$$))
};
$JSCompiler_prototypeAlias$$.$getAvailableSelectors$ = $JSCompiler_get$$("$_selectors$");
$JSCompiler_prototypeAlias$$.getItem = function $$JSCompiler_prototypeAlias$$$getItem$() {
  return{src:$annotorious$modules$image$ImageAnnotator$getItemURL$$(this.$_image$)}
};
function $annotorious$modules$image$ImageAnnotator$getItemURL$$($item$$7$$) {
  var $src$$22$$ = $item$$7$$.getAttribute("data-original");
  return $src$$22$$ ? $src$$22$$ : $item$$7$$.src
}
$JSCompiler_prototypeAlias$$.$hideAnnotations$ = function $$JSCompiler_prototypeAlias$$$$hideAnnotations$$() {
  $goog$style$showElement$$(this.$_viewCanvas$, $JSCompiler_alias_FALSE$$)
};
$JSCompiler_prototypeAlias$$.$hideSelectionWidget$ = function $$JSCompiler_prototypeAlias$$$$hideSelectionWidget$$() {
  this.$_selectionEnabled$ = $JSCompiler_alias_FALSE$$;
  this.$_hint$ && (this.$_hint$.$destroy$(), delete this.$_hint$)
};
$JSCompiler_prototypeAlias$$.$highlightAnnotation$ = function $$JSCompiler_prototypeAlias$$$$highlightAnnotation$$($annotation$$17$$) {
  this.$_viewer$.$highlightAnnotation$($annotation$$17$$)
};
$JSCompiler_prototypeAlias$$.$removeAnnotation$ = function $$JSCompiler_prototypeAlias$$$$removeAnnotation$$($annotation$$18$$) {
  this.$_viewer$.$removeAnnotation$($annotation$$18$$)
};
$JSCompiler_prototypeAlias$$.$removeHandler$ = function $$JSCompiler_prototypeAlias$$$$removeHandler$$($type$$86$$, $handler$$13$$) {
  this.$_eventBroker$.$removeHandler$($type$$86$$, $handler$$13$$)
};
$JSCompiler_prototypeAlias$$.$setActiveSelector$ = function $$JSCompiler_prototypeAlias$$$$setActiveSelector$$($selector$$10$$) {
  (this.$_currentSelector$ = $goog$array$find$$(this.$_selectors$, function($sel$$) {
    return $sel$$.getName() == $selector$$10$$
  })) || console.log('WARNING: selector "' + $selector$$10$$ + '" not available')
};
$JSCompiler_prototypeAlias$$.$showAnnotations$ = function $$JSCompiler_prototypeAlias$$$$showAnnotations$$() {
  $goog$style$showElement$$(this.$_viewCanvas$, $JSCompiler_alias_TRUE$$)
};
$JSCompiler_prototypeAlias$$.$showSelectionWidget$ = function $$JSCompiler_prototypeAlias$$$$showSelectionWidget$$() {
  this.$_selectionEnabled$ = $JSCompiler_alias_TRUE$$;
  this.$_hint$ || (this.$_hint$ = new $annotorious$hint$Hint$$(this, this.element))
};
$JSCompiler_prototypeAlias$$.stopSelection = function $$JSCompiler_prototypeAlias$$$stopSelection$($opt_original_annotation$$) {
  $goog$style$showElement$$(this.$_editCanvas$, $JSCompiler_alias_FALSE$$);
  this.$_currentSelector$.stopSelection();
  $opt_original_annotation$$ && this.$_viewer$.$addAnnotation$($opt_original_annotation$$)
};
$JSCompiler_prototypeAlias$$.$toItemCoordinates$ = function $$JSCompiler_prototypeAlias$$$$toItemCoordinates$$($xy$$6$$) {
  var $imgSize$$1$$ = $goog$style$getSize$$(this.$_image$);
  return{x:$xy$$6$$.x / $imgSize$$1$$.width, y:$xy$$6$$.y / $imgSize$$1$$.height}
};
$annotorious$modules$image$ImageAnnotator$$.prototype.fireEvent = $annotorious$modules$image$ImageAnnotator$$.prototype.fireEvent;
$annotorious$modules$image$ImageAnnotator$$.prototype.toItemCoordinates = $annotorious$modules$image$ImageAnnotator$$.prototype.$toItemCoordinates$;
function $annotorious$modules$image$ImageModule$$() {
  $JSCompiler_StaticMethods__initFields$$(this, function() {
    return $query$$inline_152$$("img.annotatable", document)
  })
}
$goog$inherits$$($annotorious$modules$image$ImageModule$$, $annotorious$modules$Module$$);
$annotorious$modules$image$ImageModule$$.prototype.$getItemURL$ = function $$annotorious$modules$image$ImageModule$$$$$getItemURL$$($item$$8$$) {
  return $annotorious$modules$image$ImageAnnotator$getItemURL$$($item$$8$$)
};
$annotorious$modules$image$ImageModule$$.prototype.$newAnnotator$ = function $$annotorious$modules$image$ImageModule$$$$$newAnnotator$$($item$$9$$) {
  return new $annotorious$modules$image$ImageAnnotator$$($item$$9$$)
};
$annotorious$modules$image$ImageModule$$.prototype.$supports$ = function $$annotorious$modules$image$ImageModule$$$$$supports$$($item$$10$$) {
  return $goog$dom$isElement$$($item$$10$$) ? "IMG" == $item$$10$$.tagName : $JSCompiler_alias_FALSE$$
};
function $annotorious$templates$openlayers$secondaryHint$$($opt_data$$7$$) {
  return'<div class="annotorious-opacity-fade" style="white-space:nowrap; position:absolute; pointer-events:none; top:80px; width:100%; text-align:center;"><div class="annotorious-ol-hint" style="width: 400px; margin:0px auto;">' + $soy$$0$0escapeHtml$$($opt_data$$7$$.$msg$) + "</dvi></div>"
}
;function $annotorious$modules$openlayers$Viewer$$($map$$10$$, $annotator$$27$$) {
  this.$_map$ = $map$$10$$;
  this.$_map_bounds$ = $goog$style$getBounds$$($annotator$$27$$.element);
  this.$_popup$ = $annotator$$27$$.popup;
  $goog$style$setStyle$$(this.$_popup$.element, "z-index", 99E3);
  this.$_overlays$ = [];
  this.$_boxesLayer$ = new OpenLayers.Layer.Boxes("Annotorious");
  this.$_map$.addLayer(this.$_boxesLayer$);
  var $self$$21$$ = this;
  this.$_map$.events.register("move", this.$_map$, function() {
    $self$$21$$.$_currentlyHighlightedOverlay$ && $JSCompiler_StaticMethods__place_popup$$($self$$21$$)
  });
  $annotator$$27$$.$addHandler$("beforePopupHide", function() {
    $self$$21$$.$_lastHoveredOverlay$ == $self$$21$$.$_currentlyHighlightedOverlay$ ? $JSCompiler_StaticMethods_clearHideTimer$$($self$$21$$.$_popup$) : $JSCompiler_StaticMethods__updateHighlight$$($self$$21$$, $self$$21$$.$_lastHoveredOverlay$, $self$$21$$.$_currentlyHighlightedOverlay$)
  })
}
function $JSCompiler_StaticMethods__place_popup$$($JSCompiler_StaticMethods__place_popup$self$$) {
  var $JSCompiler_object_inline_top_2_annotation_div_popup_pos$$ = $JSCompiler_StaticMethods__place_popup$self$$.$_currentlyHighlightedOverlay$.$marker$.div, $annotation_dim_popup_bounds$$ = $goog$style$getBounds$$($JSCompiler_object_inline_top_2_annotation_div_popup_pos$$), $JSCompiler_object_inline_left_3_annotation_pos$$ = $goog$style$getRelativePosition$$($JSCompiler_object_inline_top_2_annotation_div_popup_pos$$, $JSCompiler_StaticMethods__place_popup$self$$.$_map$.div), $JSCompiler_object_inline_top_2_annotation_div_popup_pos$$ =
  $JSCompiler_object_inline_left_3_annotation_pos$$.y, $JSCompiler_object_inline_left_3_annotation_pos$$ = $JSCompiler_object_inline_left_3_annotation_pos$$.x, $JSCompiler_object_inline_width_4$$ = $annotation_dim_popup_bounds$$.width, $JSCompiler_object_inline_height_5$$ = $annotation_dim_popup_bounds$$.height, $annotation_dim_popup_bounds$$ = $goog$style$getBounds$$($JSCompiler_StaticMethods__place_popup$self$$.$_popup$.element), $JSCompiler_object_inline_top_2_annotation_div_popup_pos$$ = {y:$JSCompiler_object_inline_top_2_annotation_div_popup_pos$$ +
  $JSCompiler_object_inline_height_5$$ + 5};
  $JSCompiler_object_inline_left_3_annotation_pos$$ + $annotation_dim_popup_bounds$$.width > $JSCompiler_StaticMethods__place_popup$self$$.$_map_bounds$.width ? ($goog$dom$classes$addRemove$$($JSCompiler_StaticMethods__place_popup$self$$.$_popup$.element, "top-left", "top-right"), $JSCompiler_object_inline_top_2_annotation_div_popup_pos$$.x = $JSCompiler_object_inline_left_3_annotation_pos$$ + $JSCompiler_object_inline_width_4$$ - $annotation_dim_popup_bounds$$.width) : ($goog$dom$classes$addRemove$$($JSCompiler_StaticMethods__place_popup$self$$.$_popup$.element,
  "top-right", "top-left"), $JSCompiler_object_inline_top_2_annotation_div_popup_pos$$.x = $JSCompiler_object_inline_left_3_annotation_pos$$);
  0 > $JSCompiler_object_inline_top_2_annotation_div_popup_pos$$.x && ($JSCompiler_object_inline_top_2_annotation_div_popup_pos$$.x = 0);
  $JSCompiler_object_inline_top_2_annotation_div_popup_pos$$.x + $annotation_dim_popup_bounds$$.width > $JSCompiler_StaticMethods__place_popup$self$$.$_map_bounds$.width && ($JSCompiler_object_inline_top_2_annotation_div_popup_pos$$.x = $JSCompiler_StaticMethods__place_popup$self$$.$_map_bounds$.width - $annotation_dim_popup_bounds$$.width);
  $JSCompiler_object_inline_top_2_annotation_div_popup_pos$$.y + $annotation_dim_popup_bounds$$.height > $JSCompiler_StaticMethods__place_popup$self$$.$_map_bounds$.height && ($JSCompiler_object_inline_top_2_annotation_div_popup_pos$$.y = $JSCompiler_StaticMethods__place_popup$self$$.$_map_bounds$.height - $annotation_dim_popup_bounds$$.height);
  $JSCompiler_StaticMethods__place_popup$self$$.$_popup$.$setPosition$($JSCompiler_object_inline_top_2_annotation_div_popup_pos$$)
}
function $JSCompiler_StaticMethods__updateHighlight$$($JSCompiler_StaticMethods__updateHighlight$self$$, $new_highlight$$, $previous_highlight$$) {
  $new_highlight$$ ? ($goog$style$getRelativePosition$$($new_highlight$$.$marker$.div, $JSCompiler_StaticMethods__updateHighlight$self$$.$_map$.div), $goog$string$toCamelCase$$("height"), $goog$style$setStyle$$($new_highlight$$.$inner$, "border-color", "#fff000"), $JSCompiler_StaticMethods__updateHighlight$self$$.$_currentlyHighlightedOverlay$ = $new_highlight$$, $JSCompiler_StaticMethods_setAnnotation$$($JSCompiler_StaticMethods__updateHighlight$self$$.$_popup$, $new_highlight$$.$annotation$), $JSCompiler_StaticMethods__place_popup$$($JSCompiler_StaticMethods__updateHighlight$self$$),
  $JSCompiler_StaticMethods__updateHighlight$self$$.$_popup$.show()) : delete $JSCompiler_StaticMethods__updateHighlight$self$$.$_currentlyHighlightedOverlay$;
  $previous_highlight$$ && $goog$style$setStyle$$($previous_highlight$$.$inner$, "border-color", "#fff")
}
$annotorious$modules$openlayers$Viewer$$.prototype.$addAnnotation$ = function $$annotorious$modules$openlayers$Viewer$$$$$addAnnotation$$($annotation$$20$$) {
  var $geometry$$1_marker$$ = $annotation$$20$$.shapes[0].geometry, $geometry$$1_marker$$ = new OpenLayers.Marker.Box(new OpenLayers.Bounds($geometry$$1_marker$$.x, $geometry$$1_marker$$.y, $geometry$$1_marker$$.x + $geometry$$1_marker$$.width, $geometry$$1_marker$$.y + $geometry$$1_marker$$.height));
  $goog$dom$classes$add$$($geometry$$1_marker$$.div, "annotorious-ol-boxmarker-outer");
  $goog$style$setStyle$$($geometry$$1_marker$$.div, "border", $JSCompiler_alias_NULL$$);
  var $inner$$ = $goog$dom$createDom$$("div", "annotorious-ol-boxmarker-inner");
  $goog$style$setSize$$($inner$$, "100%", "100%");
  $geometry$$1_marker$$.div.appendChild($inner$$);
  var $overlay$$ = {$annotation$:$annotation$$20$$, $marker$:$geometry$$1_marker$$, $inner$:$inner$$}, $self$$22$$ = this;
  $goog$events$listen$$($inner$$, "mouseover", function() {
    $self$$22$$.$_currentlyHighlightedOverlay$ || $JSCompiler_StaticMethods__updateHighlight$$($self$$22$$, $overlay$$);
    $self$$22$$.$_lastHoveredOverlay$ = $overlay$$
  });
  $goog$events$listen$$($inner$$, "mouseout", function() {
    delete $self$$22$$.$_lastHoveredOverlay$;
    $JSCompiler_StaticMethods_startHideTimer$$($self$$22$$.$_popup$)
  });
  this.$_overlays$.push($overlay$$);
  $goog$array$ARRAY_PROTOTYPE_$$.sort.call(this.$_overlays$, function($a$$32$$, $b$$27$$) {
    return $annotorious$shape$getSize$$($b$$27$$.$annotation$.shapes[0]) - $annotorious$shape$getSize$$($a$$32$$.$annotation$.shapes[0])
  } || $goog$array$defaultCompare$$);
  var $zIndex$$ = 1E4;
  $goog$array$forEach$$(this.$_overlays$, function($overlay$$1$$) {
    $goog$style$setStyle$$($overlay$$1$$.$marker$.div, "z-index", $zIndex$$);
    $zIndex$$++
  });
  this.$_boxesLayer$.addMarker($geometry$$1_marker$$)
};
$annotorious$modules$openlayers$Viewer$$.prototype.$removeAnnotation$ = function $$annotorious$modules$openlayers$Viewer$$$$$removeAnnotation$$($annotation$$21$$) {
  var $overlay$$2$$ = $goog$array$find$$(this.$_overlays$, function($overlay$$3$$) {
    return $overlay$$3$$.$annotation$ == $annotation$$21$$
  });
  $overlay$$2$$ && ($goog$array$remove$$(this.$_overlays$, $overlay$$2$$), this.$_boxesLayer$.removeMarker($overlay$$2$$.$marker$))
};
$annotorious$modules$openlayers$Viewer$$.prototype.$getAnnotations$ = $JSCompiler_emptyFn$$();
$annotorious$modules$openlayers$Viewer$$.prototype.$highlightAnnotation$ = function $$annotorious$modules$openlayers$Viewer$$$$$highlightAnnotation$$($opt_annotation$$2$$) {
  $opt_annotation$$2$$ || $JSCompiler_StaticMethods_startHideTimer$$(this.$_popup$)
};
function $annotorious$modules$openlayers$OpenLayersAnnotator$$($map$$11$$) {
  this.$_map$ = $map$$11$$;
  this.$_div$ = $map$$11$$.div;
  var $width$$21$$ = parseInt($goog$style$getComputedStyle$$(this.$_div$, "width"), 10), $height$$27$$ = parseInt($goog$style$getComputedStyle$$(this.$_div$, "height"), 10);
  this.$_eventBroker$ = new $annotorious$events$EventBroker$$;
  this.element = $goog$dom$createDom$$("div", "annotorious-annotationlayer");
  $goog$style$setStyle$$(this.element, "position", "relative");
  $goog$style$setSize$$(this.element, $width$$21$$, $height$$27$$);
  $goog$dom$replaceNode$$(this.element, this.$_div$);
  this.element.appendChild(this.$_div$);
  this.$_secondaryHint$ = $goog$soy$renderAsElement$$($annotorious$templates$openlayers$secondaryHint$$, {$msg$:"Click and Drag"});
  $goog$style$setStyle$$(this.$_secondaryHint$, "z-index", 9998);
  $goog$style$setOpacity$$(this.$_secondaryHint$, 0);
  this.element.appendChild(this.$_secondaryHint$);
  this.popup = new $annotorious$viewer$Popup$$(this);
  this.$_viewer$ = new $annotorious$modules$openlayers$Viewer$$($map$$11$$, this);
  this.$_editCanvas$ = $goog$soy$renderAsElement$$($annotorious$templates$image$canvas$$, {width:$width$$21$$, height:$height$$27$$});
  $goog$style$showElement$$(this.$_editCanvas$, $JSCompiler_alias_FALSE$$);
  $goog$style$setStyle$$(this.$_editCanvas$, "z-index", 9999);
  this.element.appendChild(this.$_editCanvas$);
  this.$_selector$ = new $annotorious$plugins$selection$RectDragSelector$$;
  this.$_selector$.init(this.$_editCanvas$, this);
  this.$_stop_selection_callback$ = $JSCompiler_alias_VOID$$;
  this.editor = new $annotorious$editor$Editor$$(this);
  $goog$style$setStyle$$(this.editor.element, "z-index", 1E4);
  var $self$$23$$ = this;
  $goog$events$listen$$(this.element, "mouseover", function($event$$28_relatedTarget$$3$$) {
    $event$$28_relatedTarget$$3$$ = $event$$28_relatedTarget$$3$$.relatedTarget;
    (!$event$$28_relatedTarget$$3$$ || !$goog$dom$contains$$($self$$23$$.element, $event$$28_relatedTarget$$3$$)) && $self$$23$$.$_eventBroker$.fireEvent("onMouseOverItem")
  });
  $goog$events$listen$$(this.element, "mouseout", function($event$$29_relatedTarget$$4$$) {
    $event$$29_relatedTarget$$4$$ = $event$$29_relatedTarget$$4$$.relatedTarget;
    (!$event$$29_relatedTarget$$4$$ || !$goog$dom$contains$$($self$$23$$.element, $event$$29_relatedTarget$$4$$)) && $self$$23$$.$_eventBroker$.fireEvent("onMouseOutOfItem")
  });
  $goog$events$listen$$(this.$_editCanvas$, "mousedown", function($event$$30$$) {
    var $offset$$18$$ = $goog$style$getClientPosition$$($self$$23$$.$_div$);
    $self$$23$$.$_selector$.startSelection($event$$30$$.clientX - $offset$$18$$.x, $event$$30$$.clientY - $offset$$18$$.y)
  });
  this.$_eventBroker$.$addHandler$("onSelectionCompleted", function($bounds$$2_event$$31$$) {
    $goog$style$setStyle$$($self$$23$$.$_editCanvas$, "pointer-events", "none");
    $bounds$$2_event$$31$$ = $bounds$$2_event$$31$$.viewportBounds;
    $self$$23$$.editor.$setPosition$(new $annotorious$shape$geom$Point$$($bounds$$2_event$$31$$.left + $self$$23$$.$_div$.offsetLeft, $bounds$$2_event$$31$$.bottom + 4 + $self$$23$$.$_div$.offsetTop));
    $self$$23$$.editor.open()
  });
  this.$_eventBroker$.$addHandler$("onSelectionCanceled", function() {
    $self$$23$$.stopSelection()
  })
}
$JSCompiler_prototypeAlias$$ = $annotorious$modules$openlayers$OpenLayersAnnotator$$.prototype;
$JSCompiler_prototypeAlias$$.$showSelectionWidget$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$hideSelectionWidget$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$activateSelector$ = function $$JSCompiler_prototypeAlias$$$$activateSelector$$($callback$$36$$) {
  $goog$style$setStyle$$(this.$_editCanvas$, "pointer-events", "auto");
  var $self$$24$$ = this;
  $goog$style$showElement$$(this.$_editCanvas$, $JSCompiler_alias_TRUE$$);
  $goog$style$setOpacity$$(this.$_secondaryHint$, 0.8);
  window.setTimeout(function() {
    $goog$style$setOpacity$$($self$$24$$.$_secondaryHint$, 0)
  }, 2E3);
  $callback$$36$$ && (this.$_stop_selection_callback$ = $callback$$36$$)
};
$JSCompiler_prototypeAlias$$.$editAnnotation$ = function $$JSCompiler_prototypeAlias$$$$editAnnotation$$($annotation$$22$$) {
  this.$_viewer$.$removeAnnotation$($annotation$$22$$);
  var $selector$$11_viewportBounds$$1$$ = this.$_selector$, $self$$25$$ = this;
  if($selector$$11_viewportBounds$$1$$) {
    $goog$style$showElement$$(this.$_editCanvas$, $JSCompiler_alias_TRUE$$);
    this.$_viewer$.$highlightAnnotation$($JSCompiler_alias_VOID$$);
    var $g2d$$2$$ = this.$_editCanvas$.getContext("2d"), $viewportShape$$2$$ = $annotorious$shape$transform$$($annotation$$22$$.shapes[0], function($xy$$7$$) {
      return $self$$25$$.$fromItemCoordinates$($xy$$7$$)
    });
    $selector$$11_viewportBounds$$1$$.drawShape($g2d$$2$$, $viewportShape$$2$$);
    $selector$$11_viewportBounds$$1$$ = $annotorious$shape$getBoundingRect$$($viewportShape$$2$$).geometry;
    this.editor.$setPosition$(new $annotorious$shape$geom$Point$$($selector$$11_viewportBounds$$1$$.x + this.$_div$.offsetLeft, $selector$$11_viewportBounds$$1$$.y + $selector$$11_viewportBounds$$1$$.height + 4 + this.$_div$.offsetTop));
    this.editor.open($annotation$$22$$)
  }
};
$JSCompiler_prototypeAlias$$.$addAnnotation$ = function $$JSCompiler_prototypeAlias$$$$addAnnotation$$($annotation$$23$$) {
  this.$_viewer$.$addAnnotation$($annotation$$23$$)
};
$JSCompiler_prototypeAlias$$.$addHandler$ = function $$JSCompiler_prototypeAlias$$$$addHandler$$($type$$88$$, $handler$$14$$) {
  this.$_eventBroker$.$addHandler$($type$$88$$, $handler$$14$$)
};
$JSCompiler_prototypeAlias$$.$addSelector$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.fireEvent = function $$JSCompiler_prototypeAlias$$$fireEvent$($type$$89$$, $event$$33$$) {
  return this.$_eventBroker$.fireEvent($type$$89$$, $event$$33$$)
};
$JSCompiler_prototypeAlias$$.$fromItemCoordinates$ = function $$JSCompiler_prototypeAlias$$$$fromItemCoordinates$$($itemCoords_pxCoords$$) {
  $itemCoords_pxCoords$$ = this.$_map$.getViewPortPxFromLonLat(new OpenLayers.LonLat($itemCoords_pxCoords$$.x, $itemCoords_pxCoords$$.y));
  return{x:$itemCoords_pxCoords$$.x, y:$itemCoords_pxCoords$$.y}
};
$JSCompiler_prototypeAlias$$.$getActiveSelector$ = $JSCompiler_get$$("$_selector$");
$JSCompiler_prototypeAlias$$.$getAnnotations$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$getAvailableSelectors$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.getItem = function $$JSCompiler_prototypeAlias$$$getItem$() {
  return{src:"map://openlayers/something"}
};
$JSCompiler_prototypeAlias$$.$highlightAnnotation$ = function $$JSCompiler_prototypeAlias$$$$highlightAnnotation$$($annotation$$24$$) {
  this.$_viewer$.$highlightAnnotation$($annotation$$24$$)
};
$JSCompiler_prototypeAlias$$.$removeAnnotation$ = function $$JSCompiler_prototypeAlias$$$$removeAnnotation$$($annotation$$25$$) {
  this.$_viewer$.$removeAnnotation$($annotation$$25$$)
};
$JSCompiler_prototypeAlias$$.$removeHandler$ = function $$JSCompiler_prototypeAlias$$$$removeHandler$$($type$$90$$, $handler$$15$$) {
  this.$_eventBroker$.$removeHandler$($type$$90$$, $handler$$15$$)
};
$JSCompiler_prototypeAlias$$.$setActiveSelector$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.stopSelection = function $$JSCompiler_prototypeAlias$$$stopSelection$($original_annotation$$) {
  $goog$style$showElement$$(this.$_editCanvas$, $JSCompiler_alias_FALSE$$);
  this.$_stop_selection_callback$ && (this.$_stop_selection_callback$(), delete this.$_stop_selection_callback$);
  this.$_selector$.stopSelection();
  $original_annotation$$ && this.$_viewer$.$addAnnotation$($original_annotation$$)
};
$JSCompiler_prototypeAlias$$.$toItemCoordinates$ = function $$JSCompiler_prototypeAlias$$$$toItemCoordinates$$($itemCoords$$1_xy$$8$$) {
  $itemCoords$$1_xy$$8$$ = this.$_map$.getLonLatFromPixel(new OpenLayers.Pixel($itemCoords$$1_xy$$8$$.x, $itemCoords$$1_xy$$8$$.y));
  return{x:$itemCoords$$1_xy$$8$$.lon, y:$itemCoords$$1_xy$$8$$.lat}
};
function $annotorious$modules$openlayers$OpenLayersModule$$() {
  $JSCompiler_StaticMethods__initFields$$(this)
}
$goog$inherits$$($annotorious$modules$openlayers$OpenLayersModule$$, $annotorious$modules$Module$$);
$annotorious$modules$openlayers$OpenLayersModule$$.prototype.$getItemURL$ = $JSCompiler_returnArg$$("map://openlayers/something");
$annotorious$modules$openlayers$OpenLayersModule$$.prototype.$newAnnotator$ = function $$annotorious$modules$openlayers$OpenLayersModule$$$$$newAnnotator$$($item$$12$$) {
  return new $annotorious$modules$openlayers$OpenLayersAnnotator$$($item$$12$$)
};
$annotorious$modules$openlayers$OpenLayersModule$$.prototype.$supports$ = function $$annotorious$modules$openlayers$OpenLayersModule$$$$$supports$$($item$$13$$) {
  return $item$$13$$ instanceof OpenLayers.Map
};
function $annotorious$Annotorious$$() {
  function $fn$$inline_776$$() {
    $goog$array$forEach$$($self$$26$$.$_modules$, function($module$$) {
      $module$$.init()
    });
    $goog$array$forEach$$($self$$26$$.$_plugins$, function($plugin$$3$$) {
      $plugin$$3$$.initPlugin && $plugin$$3$$.initPlugin($self$$26$$);
      $goog$array$forEach$$($self$$26$$.$_modules$, function($module$$1$$) {
        $module$$1$$.$addPlugin$($plugin$$3$$)
      })
    })
  }
  this.$_modules$ = [new $annotorious$modules$image$ImageModule$$];
  $annotorious$modules$openlayers$OpenLayersModule$$ && this.$_modules$.push(new $annotorious$modules$openlayers$OpenLayersModule$$);
  this.$_plugins$ = [];
  var $self$$26$$ = this;
  window.addEventListener ? window.addEventListener("load", $fn$$inline_776$$, $JSCompiler_alias_FALSE$$) : window.attachEvent && window.attachEvent("onload", $fn$$inline_776$$)
}
function $JSCompiler_StaticMethods__getModuleForItemSrc$$($JSCompiler_StaticMethods__getModuleForItemSrc$self$$, $item_src$$1$$) {
  return $goog$array$find$$($JSCompiler_StaticMethods__getModuleForItemSrc$self$$.$_modules$, function($module$$2$$) {
    return $JSCompiler_StaticMethods_annotatesItem$$($module$$2$$, $item_src$$1$$)
  })
}
$JSCompiler_prototypeAlias$$ = $annotorious$Annotorious$$.prototype;
$JSCompiler_prototypeAlias$$.$activateSelector$ = function $$JSCompiler_prototypeAlias$$$$activateSelector$$($opt_item_url_or_callback$$1$$, $opt_callback$$6$$) {
  var $item_url$$7$$ = $JSCompiler_alias_VOID$$, $callback$$37$$ = $JSCompiler_alias_VOID$$;
  $goog$isString$$($opt_item_url_or_callback$$1$$) ? ($item_url$$7$$ = $opt_item_url_or_callback$$1$$, $callback$$37$$ = $opt_callback$$6$$) : $goog$isFunction$$($opt_item_url_or_callback$$1$$) && ($callback$$37$$ = $opt_item_url_or_callback$$1$$);
  if($item_url$$7$$) {
    var $module$$3$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $item_url$$7$$);
    $module$$3$$ && $module$$3$$.$activateSelector$($item_url$$7$$, $callback$$37$$)
  }else {
    $goog$array$forEach$$(this.$_modules$, function($module$$4$$) {
      $module$$4$$.$activateSelector$($callback$$37$$)
    })
  }
};
$JSCompiler_prototypeAlias$$.$addAnnotation$ = function $$JSCompiler_prototypeAlias$$$$addAnnotation$$($annotation$$26$$, $opt_replace$$4$$) {
  var $module$$5$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $annotation$$26$$.src);
  $module$$5$$ && $module$$5$$.$addAnnotation$($annotation$$26$$, $opt_replace$$4$$)
};
$JSCompiler_prototypeAlias$$.$addHandler$ = function $$JSCompiler_prototypeAlias$$$$addHandler$$($type$$91$$, $handler$$16$$) {
  $goog$array$forEach$$(this.$_modules$, function($module$$6$$) {
    $module$$6$$.$addHandler$($type$$91$$, $handler$$16$$)
  })
};
$JSCompiler_prototypeAlias$$.$addPlugin$ = function $$JSCompiler_prototypeAlias$$$$addPlugin$$($plugin_name$$, $opt_config_options$$) {
  try {
    this.$_plugins$.push(new window.annotorious.plugin[$plugin_name$$]($opt_config_options$$))
  }catch($error$$3$$) {
    console.log("Could not load plugin: " + $plugin_name$$)
  }
};
$JSCompiler_prototypeAlias$$.$getActiveSelector$ = function $$JSCompiler_prototypeAlias$$$$getActiveSelector$$($item_url$$8$$) {
  var $module$$7$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $item_url$$8$$);
  if($module$$7$$) {
    return $module$$7$$.$getActiveSelector$($item_url$$8$$)
  }
};
$JSCompiler_prototypeAlias$$.$getAnnotations$ = function $$JSCompiler_prototypeAlias$$$$getAnnotations$$($opt_item_url$$7$$) {
  if($opt_item_url$$7$$) {
    var $module$$8$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $opt_item_url$$7$$);
    return $module$$8$$ ? $module$$8$$.$getAnnotations$($opt_item_url$$7$$) : []
  }
  var $annotations$$3$$ = [];
  $goog$array$forEach$$(this.$_modules$, function($module$$9$$) {
    $goog$array$extend$$($annotations$$3$$, $module$$9$$.$getAnnotations$())
  });
  return $annotations$$3$$
};
$JSCompiler_prototypeAlias$$.$getAvailableSelectors$ = function $$JSCompiler_prototypeAlias$$$$getAvailableSelectors$$($item_url$$9$$) {
  var $module$$10$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $item_url$$9$$);
  return $module$$10$$ ? $module$$10$$.$getAvailableSelectors$($item_url$$9$$) : []
};
$JSCompiler_prototypeAlias$$.$hideAnnotations$ = function $$JSCompiler_prototypeAlias$$$$hideAnnotations$$($opt_item_url$$8$$) {
  if($opt_item_url$$8$$) {
    var $module$$11$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $opt_item_url$$8$$);
    $module$$11$$ && $module$$11$$.$hideAnnotations$($opt_item_url$$8$$)
  }else {
    $goog$array$forEach$$(this.$_modules$, function($module$$12$$) {
      $module$$12$$.$hideAnnotations$()
    })
  }
};
$JSCompiler_prototypeAlias$$.$hideSelectionWidget$ = function $$JSCompiler_prototypeAlias$$$$hideSelectionWidget$$($opt_item_url$$9$$) {
  if($opt_item_url$$9$$) {
    var $module$$13$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $opt_item_url$$9$$);
    $module$$13$$ && $module$$13$$.$hideSelectionWidget$($opt_item_url$$9$$)
  }else {
    $goog$array$forEach$$(this.$_modules$, function($module$$14$$) {
      $module$$14$$.$hideSelectionWidget$()
    })
  }
};
$JSCompiler_prototypeAlias$$.$highlightAnnotation$ = function $$JSCompiler_prototypeAlias$$$$highlightAnnotation$$($annotation$$27$$) {
  if($annotation$$27$$) {
    var $module$$15$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $annotation$$27$$.src);
    $module$$15$$ && $module$$15$$.$highlightAnnotation$($annotation$$27$$)
  }else {
    $goog$array$forEach$$(this.$_modules$, function($module$$16$$) {
      $module$$16$$.$highlightAnnotation$()
    })
  }
};
$JSCompiler_prototypeAlias$$.$makeAnnotatable$ = function $$JSCompiler_prototypeAlias$$$$makeAnnotatable$$($item$$14$$) {
  var $module$$17$$ = $goog$array$find$$(this.$_modules$, function($module$$18$$) {
    return $module$$18$$.$supports$($item$$14$$)
  });
  $module$$17$$ ? $module$$17$$.$makeAnnotatable$($item$$14$$) : $JSCompiler_alias_THROW$$("Error: Annotorious does not support this media type in the current version or build configuration.")
};
$JSCompiler_prototypeAlias$$.$removeAll$ = function $$JSCompiler_prototypeAlias$$$$removeAll$$($opt_item_url$$10$$) {
  var $self$$27$$ = this;
  $goog$array$forEach$$(this.$getAnnotations$($opt_item_url$$10$$), function($annotation$$28$$) {
    $self$$27$$.$removeAnnotation$($annotation$$28$$)
  })
};
$JSCompiler_prototypeAlias$$.$removeAnnotation$ = function $$JSCompiler_prototypeAlias$$$$removeAnnotation$$($annotation$$29$$) {
  var $module$$19$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $annotation$$29$$.src);
  $module$$19$$ && $module$$19$$.$removeAnnotation$($annotation$$29$$)
};
$JSCompiler_prototypeAlias$$.reset = function $$JSCompiler_prototypeAlias$$$reset$() {
  $goog$array$forEach$$(this.$_modules$, function($module$$20$$) {
    $module$$20$$.$destroy$();
    $module$$20$$.init()
  })
};
$JSCompiler_prototypeAlias$$.$addSelector$ = function $$JSCompiler_prototypeAlias$$$$addSelector$$($item_url$$10$$, $selector$$14$$) {
  var $module$$21$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $item_url$$10$$);
  $module$$21$$ && $module$$21$$.$addSelector$($item_url$$10$$, $selector$$14$$)
};
$JSCompiler_prototypeAlias$$.$setActiveSelector$ = function $$JSCompiler_prototypeAlias$$$$setActiveSelector$$($item_url$$11$$, $selector$$15$$) {
  var $module$$22$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $item_url$$11$$);
  $module$$22$$ && $module$$22$$.$setActiveSelector$($item_url$$11$$, $selector$$15$$)
};
$JSCompiler_prototypeAlias$$.$setSelectionEnabled$ = function $$JSCompiler_prototypeAlias$$$$setSelectionEnabled$$($enabled$$2$$) {
  $enabled$$2$$ ? this.$showSelectionWidget$($JSCompiler_alias_VOID$$) : this.$hideSelectionWidget$($JSCompiler_alias_VOID$$)
};
$JSCompiler_prototypeAlias$$.$showAnnotations$ = function $$JSCompiler_prototypeAlias$$$$showAnnotations$$($opt_item_url$$11$$) {
  if($opt_item_url$$11$$) {
    var $module$$23$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $opt_item_url$$11$$);
    $module$$23$$ && $module$$23$$.$showAnnotations$($opt_item_url$$11$$)
  }else {
    $goog$array$forEach$$(this.$_modules$, function($module$$24$$) {
      $module$$24$$.$showAnnotations$()
    })
  }
};
$JSCompiler_prototypeAlias$$.$showSelectionWidget$ = function $$JSCompiler_prototypeAlias$$$$showSelectionWidget$$($opt_item_url$$12$$) {
  if($opt_item_url$$12$$) {
    var $module$$25$$ = $JSCompiler_StaticMethods__getModuleForItemSrc$$(this, $opt_item_url$$12$$);
    $module$$25$$ && $module$$25$$.$showSelectionWidget$($opt_item_url$$12$$)
  }else {
    $goog$array$forEach$$(this.$_modules$, function($module$$26$$) {
      $module$$26$$.$showSelectionWidget$()
    })
  }
};
window.anno = new $annotorious$Annotorious$$;
$annotorious$Annotorious$$.prototype.activateSelector = $annotorious$Annotorious$$.prototype.$activateSelector$;
$annotorious$Annotorious$$.prototype.addAnnotation = $annotorious$Annotorious$$.prototype.$addAnnotation$;
$annotorious$Annotorious$$.prototype.addHandler = $annotorious$Annotorious$$.prototype.$addHandler$;
$annotorious$Annotorious$$.prototype.addPlugin = $annotorious$Annotorious$$.prototype.$addPlugin$;
$annotorious$Annotorious$$.prototype.getActiveSelector = $annotorious$Annotorious$$.prototype.$getActiveSelector$;
$annotorious$Annotorious$$.prototype.getAnnotations = $annotorious$Annotorious$$.prototype.$getAnnotations$;
$annotorious$Annotorious$$.prototype.getAvailableSelectors = $annotorious$Annotorious$$.prototype.$getAvailableSelectors$;
$annotorious$Annotorious$$.prototype.hideAnnotations = $annotorious$Annotorious$$.prototype.$hideAnnotations$;
$annotorious$Annotorious$$.prototype.hideSelectionWidget = $annotorious$Annotorious$$.prototype.$hideSelectionWidget$;
$annotorious$Annotorious$$.prototype.highlightAnnotation = $annotorious$Annotorious$$.prototype.$highlightAnnotation$;
$annotorious$Annotorious$$.prototype.makeAnnotatable = $annotorious$Annotorious$$.prototype.$makeAnnotatable$;
$annotorious$Annotorious$$.prototype.removeAll = $annotorious$Annotorious$$.prototype.$removeAll$;
$annotorious$Annotorious$$.prototype.removeAnnotation = $annotorious$Annotorious$$.prototype.$removeAnnotation$;
$annotorious$Annotorious$$.prototype.reset = $annotorious$Annotorious$$.prototype.reset;
$annotorious$Annotorious$$.prototype.setActiveSelector = $annotorious$Annotorious$$.prototype.$setActiveSelector$;
$annotorious$Annotorious$$.prototype.showAnnotations = $annotorious$Annotorious$$.prototype.$showAnnotations$;
$annotorious$Annotorious$$.prototype.showSelectionWidget = $annotorious$Annotorious$$.prototype.$showSelectionWidget$;
$annotorious$Annotorious$$.prototype.addSelector = $annotorious$Annotorious$$.prototype.$addSelector$;
$annotorious$Annotorious$$.prototype.setSelectionEnabled = $annotorious$Annotorious$$.prototype.$setSelectionEnabled$;
window.annotorious || (window.annotorious = {});
window.annotorious.plugin || (window.annotorious.plugin = {});

