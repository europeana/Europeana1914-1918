/*global annotorious, anno, jQuery */
/*jslint browser: true, nomen: true, regexp: true, white: true */
/**
 * Annotorious storage plugin for RunCoCo
 */
(function( annotorious, anno, $ ) {
  'use strict';

  annotorious.plugin.RunCoCo = function(config) {
    // Base URL of the RESTful annotations controller
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
    xhr.setRequestHeader(
      "X-CSRF-Token",
      $('meta[name="csrf-token"]').attr('content')
    );
  };

  annotorious.plugin.RunCoCo.prototype._loadAnnotations = function(annotator) {
    var self = this,
    params = {
      src: annotator.getItem().src
    };

    $.ajax({
      type: "GET",
      url: self._BASE_URL + ".json",
      data: params,
      beforeSend: self._preserveCSRFToken,
      success: function(response) {
        response.creatable =
          response.creatable
          ? anno.showSelectionWidget(params.src)
          : anno.hideSelectionWidget(params.src);

        $.each(response.annotations, function() {
          var annotation = this;
          annotation.src = params.src;
          anno.addAnnotation(annotation);
        });
      }
    });
  };

  annotorious.plugin.RunCoCo.prototype._create = function(annotation) {
    var self = this,
    params = {
      annotation: annotation
    };

    $.ajax({
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
    var self = this,
    params = {
      annotation: annotation
    };

    $.ajax({
      type: "PUT",
      url: self._BASE_URL + "/" + annotation.id + ".json",
      data: params,
      beforeSend: self._preserveCSRFToken
    });
  };

  annotorious.plugin.RunCoCo.prototype._delete = function(annotation) {
    var self = this;

    $.ajax({
      type: "DELETE",
      url: self._BASE_URL + "/" + annotation.id + ".json",
      beforeSend: self._preserveCSRFToken
    });
  };

}( annotorious, anno, jQuery ));
