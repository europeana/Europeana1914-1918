/**
 * Annotorious storage plugin for RunCoCo
 */
annotorious.plugin.RunCoCo = function(config) {
  this._BASE_URL = config.base_url;
};

annotorious.plugin.RunCoCo.prototype.initPlugin = function(anno) {
  var self = this;
  
  anno.addHandler('onAnnotationCreated', function(annotation) {
    self._create(annotation);
  });

  anno.addHandler('onAnnotationUpdated', function(annotation) {
    self._update(annotation);
  });

  anno.addHandler('onAnnotationRemoved', function(annotation) {
    self._delete(annotation);
  });
};

annotorious.plugin.RunCoCo.prototype.onInitAnnotator = function(annotator) {
  this._loadAnnotations(annotator);
};

annotorious.plugin.RunCoCo.prototype._preserveCSRFToken = function(xhr) {
  xhr.setRequestHeader("X-CSRF-Token", jQuery('meta[name="csrf-token"]').attr('content'));
};

annotorious.plugin.RunCoCo.prototype._loadAnnotations = function(annotator) {
  var self = this;
  var params = { src: annotator.getItem().src };
  jQuery.ajax({
    type: "GET",
    url: self._BASE_URL + ".json", 
    data: params,
    dataType: "json",
    beforeSend: self._preserveCSRFToken,
    success: function(response) {
      jQuery.each(response.annotations, function(idx, annotation) {
        annotation.src = params.src;
        anno.addAnnotation(annotation);
      });
    }
  });
};

annotorious.plugin.RunCoCo.prototype._create = function(annotation) {
  var self = this;
  var params = { annotation: annotation };
  jQuery.ajax({
    type: "POST",
    url: self._BASE_URL + ".json", 
    data: params,
    beforeSend: self._preserveCSRFToken,
    success: function(response) {
      annotation.id = response.id;
    }
  });
};

annotorious.plugin.RunCoCo.prototype._update = function(annotation) {
  var self = this;
  var params = { annotation: annotation };
  jQuery.ajax({
    type: "PUT",
    url: self._BASE_URL + "/" + annotation.id + ".json", 
    data: params,
    beforeSend: self._preserveCSRFToken
  });
};

annotorious.plugin.RunCoCo.prototype._delete = function(annotation) {
  var self = this;
  jQuery.ajax({
    type: "DELETE",
    url: self._BASE_URL + "/" + annotation.id + ".json", 
    beforeSend: self._preserveCSRFToken
  });
};
