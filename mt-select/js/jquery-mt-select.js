/**
 * @author Andrei-Robert Rusu
 * @version 1.3
 * @type {{elementInformationMAP: {tagContainer: {element: string, class: string}, tagElement: {element: string, class: string}, tagElementRemove: {element: string, class: string, content: string}}, skeletonStructure: {default: {entryInformationListHTMLSkeleton: string, entryInformationSingleContainerIdentifier: string, entryInformationHTMLSkeleton: string, responseMessageSkeleton: string}}, entryInformationListHTMLSkeleton: string, entryInformationSingleContainerIdentifier: string, entryInformationHTMLSkeleton: string, responseMessageSkeleton: string, triggerInformationMAP: {searchTriggerIdentifier: string, searchTriggerEvent: string, searchTriggerMinimumLength: number, searchTriggerCSSSettings: {width: string}}, namespace: string, containerObject: {}, tagContainerObject: {}, requestURL: string, requestMethod: string, requestSearchedTerm: string, requestSelectedTerms: string, requestExtraParams: {}, closeModalOnSelect: number, clearInputOnSelect: number, maxTags: boolean, defaultValues: Array, tagInputType: string, tagInputName: string, closeOnUnFocus: number, skeleton: string, _currentAJAXRequestObject: boolean, Init: Init, _handleSettings: _handleSettings, _handleDefaultValues: _handleDefaultValues, prependTagContainer: prependTagContainer, assignFilterTriggers: assignFilterTriggers, fetchFilteredResult: fetchFilteredResult, buildTagListDisplay: buildTagListDisplay, buildTagDisplay: buildTagDisplay, addTag: addTag, removeTag: removeTag, lockFormSubmit: lockFormSubmit, unlockFormSubmit: unlockFormSubmit, setWindowResizeEvent: setWindowResizeEvent, ModalHelper: {Controller: {}, container: boolean, displayUnder: number, currentElements: boolean, modalIDPrefix: string, modalID: string, Init: Init, DisplayMessage: DisplayMessage, Display: Display, setContainer: setContainer, arrangeContainer: arrangeContainer, Close: Close}, KeyNavigationHelper: {Controller: {}, Init: Init, keyUp: keyUp, keyDown: keyDown, scrollToElement: scrollToElement, getCurrentPointedElementAndHandleUniversal: getCurrentPointedElementAndHandleUniversal, getCurrentPointedElement: getCurrentPointedElement}}}
 */
var jQueryMTSelect = {

  elementInformationMAP : {
    tagContainer : {
      'element' : 'span',
      'class'   : 'mt-tag-container'
    },
    tagElement  : {
      'element' : 'span',
      'class'   : 'mt-tag-element'
    },
    tagElementRemove : {
      'element' : 'a',
      'class'   : 'none',
      'content' : 'X'
    }
  },

  skeletonStructure : {
    'default' : {
      entryInformationListHTMLSkeleton : '<div class="mt_search_list_container">' +
          '{entries_information_list}' +
          '</div>',
      entryInformationSingleContainerIdentifier : '.mt_entry_container',
      entryInformationHTMLSkeleton :'<div class="mt_entry_container addTag" data-tag-id="{id}" data-tag-name="{name}">' +
          '<div class="left">' +
          '<img src="{picture_path}"/>' +
          '</div>' +
          '<div class="right">' +
          '<p class="name">{name|boldSearch}</p>' +
          '<p class="description">{description|boldSearch}</p>' +
          '</div>' +
          '</div>',
      responseMessageSkeleton : '<div class="mt_search_message">{message}</div>'
    }
  },

  entryInformationListHTMLSkeleton          : '',
  entryInformationSingleContainerIdentifier : '.',
  entryInformationHTMLSkeleton              : '',
  responseMessageSkeleton                   : '',

  triggerInformationMAP : {
    searchTriggerIdentifier     : ':input[data-mt-filter-control]',
    searchTriggerEvent          : 'keyup focus',
    searchTriggerMinimumLength  : 3,
    searchTriggerCSSSettings    : {
      'width' : 'auto'
    }
  },

  namespace           : 'mt_search',
  containerObject     : {},
  tagContainerObject  : {},
  requestURL          : '',
  requestMethod       : 'POST',
  requestSearchedTerm : 'mt_filter',
  requestSelectedTerms: 'mt_selected',
  requestExtraParams  : {},
  closeModalOnSelect  : 1,
  clearInputOnSelect  : 1,
  maxTags             : false,
  defaultValues       : [],
  tagInputType        : 'hidden',
  tagInputName        : 'tag',
  closeOnUnFocus      : 1,
  skeleton            : 'default',

  _currentAJAXRequestObject : false,

  Init : function(container, settings) {
    this._handleSettings(settings);
    this.containerObject = container;

    this.ModalHelper         = this.ModalHelper.Init(this);
    this.KeyNavigationHelper = this.KeyNavigationHelper.Init(this);

    this.prependTagContainer();
    this.assignFilterTriggers();
    this._handleDefaultValues();
    this.setWindowResizeEvent();
  },

  _handleSettings : function(settings) {
    var objectInstance = this;

    this.requestURL           = typeof settings.request_url      != "undefined"  ? settings.request_url     : '';
    this.requestMethod        = typeof settings.request_method   != "undefined"  ? settings.request_method  : this.requestMethod;
    this.requestSearchedTerm  = typeof settings.request_tag_name != "undefined"  ? settings.request_tag_name  : this.requestSearchedTerm;
    this.requestSelectedTerms = typeof settings.request_selected_tags_name != "undefined"
        ? settings.request_selected_tags_name  : this.requestSelectedTerms;

    this.closeModalOnSelect = typeof settings.close_on_select  != "undefined"  ? parseInt(settings.close_on_select)   : this.closeModalOnSelect;
    this.closeOnUnFocus     = typeof settings.close_on_unfocus != "undefined"  ? parseInt(settings.close_on_unfocus)  : this.closeOnUnFocus;
    this.clearInputOnSelect = typeof settings.clear_on_select  != "undefined"  ? parseInt(settings.clear_on_select)   : this.clearInputOnSelect;

    this.tagInputName       = typeof settings.tag_input_name   != "undefined"  ? settings.tag_input_name  : this.tagInputName;
    this.tagInputType       = typeof settings.tag_input_type   != "undefined"  ? settings.tag_input_type  : this.tagInputType;
    this.maxTags            = typeof settings.max_tags         != "undefined"  ? settings.max_tags        : this.maxTags;
    this.skeleton           = typeof settings.skeleton         != "undefined"  ? settings.skeleton        : this.skeleton;

    this.namespace          = typeof settings.namespace        != "undefined"  ? settings.namespace        : this.namespace;

    if(typeof settings.default_values != "undefined")
      this.defaultValues = typeof settings.default_values == "string" ? jQuery.parseJSON(settings.default_values) : settings.default_values;

    jQuery.each(settings, function(key, value){
      if(key.indexOf('custom_param_') == 0) {
        var name = key.replace('custom_param_', '');

        objectInstance.requestExtraParams[name] = value;
      }
    });

    jQuery.each(this.skeletonStructure[this.skeleton], function(key, value){
      objectInstance[key] = value;
    });
  },

  _handleDefaultValues : function() {
    if(this.defaultValues != false) {
      var objectInstance = this;

      jQuery.each(this.defaultValues, function(key, value){
        objectInstance.addTag(key, value);
      });
    }
  },

  prependTagContainer : function() {
    this.containerObject.prepend(
        '<'  + this.elementInformationMAP.tagContainer.element + ' ' +
            'class="' + this.elementInformationMAP.tagContainer.class + '">' +
            '</' + this.elementInformationMAP.tagContainer.element + '>');

    this.tagContainerObject = this.containerObject.find('> ' + this.elementInformationMAP.tagContainer.element + '.' + (this.elementInformationMAP.tagContainer.class).replace(' ', '.'));
  },

  assignFilterTriggers   : function() {
    var objectInstance = this,
        triggers       = this.containerObject
            .find(this.triggerInformationMAP.searchTriggerIdentifier);

    jQuery.each(this.triggerInformationMAP.searchTriggerCSSSettings, function(attr, value){
      triggers.css(attr, value);
    });

    triggers.attr('autocomplete', 'off');
    triggers.val('');

    triggers.bind(this.triggerInformationMAP.searchTriggerEvent + '.' + this.namespace, function(event) {
      if(jQuery(this).val().length >= objectInstance.triggerInformationMAP.searchTriggerMinimumLength) {
        if(event.which == 38) {
          objectInstance.KeyNavigationHelper.keyUp();
        } else if(event.which == 40) {
          objectInstance.KeyNavigationHelper.keyDown();
        } else if(event.which == 13) {
          if(objectInstance.KeyNavigationHelper.getCurrentPointedElement() != false)
            objectInstance.KeyNavigationHelper.getCurrentPointedElement().click();

          return false;
        } else if(event.which == 27) {
          triggers.val('');
          objectInstance.ModalHelper.Close();
        } else {
          objectInstance.fetchFilteredResult(jQuery(this).val());
        }
      } else {
        objectInstance.ModalHelper.Close();
      }
    });

    if(this.closeOnUnFocus)
      triggers.focusout(function(){
        setTimeout(function(){
          objectInstance.ModalHelper.Close();
        }, 500);
      });
  },

  fetchFilteredResult : function(search) {
    var objectInstance = this;

    if(this._currentAJAXRequestObject != false)
      this._currentAJAXRequestObject.abort();

    var tagIds = [];

    this.tagContainerObject.find('input[type="' + this.tagInputType + '"][data-tag-id]').each(function(){
      tagIds[tagIds.length] = jQuery(this).val();
    });

    var requestData = this.requestExtraParams;

    requestData[this.requestSearchedTerm] = search;
    requestData[this.requestSelectedTerms] = tagIds;

    this._currentAJAXRequestObject = jQuery.ajax({
      type     : this.requestMethod,
      url      : this.requestURL,
      context  : document.body,
      dataType : 'json',
      data     : requestData
    }).done(function(response) {
      objectInstance.ModalHelper.Close();

      if(response.status == 'empty') {
        if(typeof response.message !== "undefined")
          objectInstance.ModalHelper.DisplayMessage(
              objectInstance.responseMessageSkeleton.replace('{message}', response.message),
              objectInstance.containerObject.find(objectInstance.triggerInformationMAP.searchTriggerIdentifier).filter(':first')
          );

        return;
      }

      var modalContent  = objectInstance.buildTagListDisplay(response.results, search),
          displayUnder  = objectInstance.containerObject.find(objectInstance.triggerInformationMAP.searchTriggerIdentifier).filter(':first');

      objectInstance.ModalHelper.Display(modalContent, displayUnder);
      objectInstance._currentAJAXRequestObject = false;
    });
  },

  buildTagListDisplay : function(tagListInformation, searchParam) {
    var entryListHTML = '', objectInstance = this;

    jQuery.each(tagListInformation, function(key, tagInformation){
      entryListHTML += objectInstance.buildTagDisplay(tagInformation, searchParam);
    });

    return this.entryInformationListHTMLSkeleton.replace('{entries_information_list}', entryListHTML);
  },

  buildTagDisplay : function(tagInformation, searchParam) {
    var html = this.entryInformationHTMLSkeleton;


    jQuery.each(tagInformation, function(key, value){
      html = html.replace('{' + key + '|boldSearch}', value.replace(searchParam, '<strong>' + searchParam + '</strong>'));

      html = html.replace(new RegExp('{' + key + '}', 'g'), value);
    });

    return html;
  },

  addTag : function(tagId, tagName) {
    if(this.tagContainerObject.find('[data-tag-id="' + tagId + '"]').length > 0)
      return;

    var objectInstance = this;

    this.tagContainerObject.append(
        '<input type="' + this.tagInputType + '" ' +
            'name="' + this.tagInputName + '[' +
            (this.tagContainerObject.find('[data-tag-id]').length > 0
                ? ( parseInt(this.tagContainerObject.find('[data-tag-id]:last').attr('data-tag-id'), 10) + 1 )
                : 1) +
            ']" ' +
            'value="' + tagId + '"' +
            'data-tag-id="' + tagId + '"' +
            '/>'
    );

    this.tagContainerObject.append(
        '<'  + this.elementInformationMAP.tagElement.element + ' ' +
            'class="' + this.elementInformationMAP.tagElement.class + '" ' +
            'data-tag-id="' + tagId + '" ' +
            '>' +
            tagName +
            (
                '<' + this.elementInformationMAP.tagElementRemove.element + ' ' +
                    'class="' + this.elementInformationMAP.tagElement.class + '" ' +
                    'data-tag-remove-id="' + tagId + '" ' +
                    '>' +
                    this.elementInformationMAP.tagElementRemove.content +
                    '</' + this.elementInformationMAP.tagElementRemove.element + '>'
                ) +
            '</' + this.elementInformationMAP.tagElement.element + '>');

    this.tagContainerObject.find('[data-tag-remove-id="' + tagId + '"]').bind('click.' + this.namespace, function(){
      objectInstance.removeTag(jQuery(this).attr('data-tag-remove-id'));
    });

    if(this.tagContainerObject.find('input[type="' + this.tagInputType + '"][data-tag-id]').length >= this.maxTags)
      this.containerObject.find(this.triggerInformationMAP.searchTriggerIdentifier).fadeOut('slow');
  },

  removeTag : function(tagId) {
    var objectInstance = this;

    this.tagContainerObject.find('[data-tag-id="' + tagId + '"]').fadeOut('fast', function(){
      jQuery(this).unbind(objectInstance.namespace);
      jQuery(this).remove();
    });

    this.containerObject.find(this.triggerInformationMAP.searchTriggerIdentifier + ':hidden').fadeIn('slow', function(){
      jQuery(this).focus();
    });
  },

  lockFormSubmit : function() {
    if(this.containerObject.is('form'))
      this.containerObject.attr('onkeypress', 'return event.keyCode != 13');
    else
      this.containerObject.parents('form:first').attr('onkeypress', 'return event.keyCode != 13');
  },

  unlockFormSubmit : function() {
    if(this.containerObject.is('form'))
      this.containerObject.attr('onkeypress', '');
    else
      this.containerObject.parents('form:first').attr('onkeypress', '');
  },

  setWindowResizeEvent : function() {
    var objectInstance = this;

    jQuery(window).bind('resize orientationchange', function(){
      objectInstance.ModalHelper.arrangeContainer();
    });
  },

  ModalHelper : {

    /**
     * @var EasyAutoComplete
     */
    Controller      : {},
    container       : false,
    displayUnder    : 0,
    currentElements : false,
    modalIDPrefix   : "jquery-mt-select-",
    modalID         : "",

    Init    : function(controller) {
      this.Controller = controller;

      this.modalID    = this.modalIDPrefix + this.Controller.namespace;

      return jQuery.extend(1, {}, this);
    },

    DisplayMessage : function(message, displayUnder) {
      var objectInstance = this;

      this.displayUnder = displayUnder;
      this.setContainer(message);
      this.arrangeContainer();
      this.Controller.lockFormSubmit();
    },

    Display : function(content, displayUnder) {
      var objectInstance = this;

      this.displayUnder = displayUnder;
      this.setContainer(content);
      this.arrangeContainer();
      this.Controller.lockFormSubmit();

      this.container.find('.addTag').unbind('click').bind('click.' + this.Controller.namespace, function(){
        objectInstance.Controller.addTag(jQuery(this).attr('data-tag-id'), jQuery(this).attr('data-tag-name'));

        if(objectInstance.Controller.clearInputOnSelect == 1) {
          var triggers = objectInstance.Controller.containerObject.find(objectInstance.Controller.triggerInformationMAP.searchTriggerIdentifier);
          triggers.val('');
          triggers.first().focus();
        }

        if(objectInstance.Controller.closeModalOnSelect == 1) {
          objectInstance.Close();
        } else {
          jQuery(this).remove();
          objectInstance.arrangeContainer();
        }
      });
    },

    setContainer  : function(content) {
      jQuery('body').append('<div id="' + this.modalID + '" class="modal-helper">' + content + '</div>');

      this.container = jQuery('#' + this.modalID);

      this.currentElements = this.container.find(this.Controller.entryInformationSingleContainerIdentifier);
    },

    arrangeContainer : function() {
      if(this.container == false)
        return;

      this.container.css('position', 'absolute');
      this.container.css('top',
          this.displayUnder.offset().top +
              this.displayUnder.height() +
              parseInt(this.displayUnder.css('padding-top'), 10) +
              parseInt(this.displayUnder.css('padding-bottom'), 10)
      );
      this.container.css('left', this.displayUnder.offset().left);
    },

    Close : function() {
      if(this.container != false) {
        this.currentElements = false;

        this.Controller.unlockFormSubmit();

        this.container.find('.addTag').unbind('click.' + this.Controller.namespace);
        this.container.remove();
      }

      this.container = false;
    }

  },

  KeyNavigationHelper : {

    Controller : {},

    Init : function(controller) {
      this.Controller = controller;

      return jQuery.extend(1, {}, this);
    },

    keyUp : function() {
      if(this.Controller.ModalHelper.currentElements == false)
        return;

      var currentPointedElement = this.getCurrentPointedElementAndHandleUniversal();

      currentPointedElement = (
          typeof currentPointedElement == "undefined"
              || currentPointedElement == false
              || currentPointedElement.prev().length == 0
          )
          ? this.Controller.ModalHelper.currentElements.filter(':last')
          : currentPointedElement.prev();

      currentPointedElement.removeClass('inactive').addClass('active');

      this.scrollToElement(currentPointedElement);
    },

    keyDown : function() {
      if(this.Controller.ModalHelper.currentElements == false)
        return;

      var currentPointedElement = this.getCurrentPointedElementAndHandleUniversal();

      currentPointedElement = (
          typeof currentPointedElement == "undefined"
              || currentPointedElement == false
              || currentPointedElement.next().length == 0
          )
          ? this.Controller.ModalHelper.currentElements.filter(':first')
          : currentPointedElement.next();

      currentPointedElement.removeClass('inactive').addClass('active');

      this.scrollToElement(currentPointedElement);
    },

    scrollToElement : function(currentPointedElement) {
      this.Controller.ModalHelper.container.find('> *:first').animate({
        scrollTop: currentPointedElement.position().top
      }, 200);
    },

    getCurrentPointedElementAndHandleUniversal : function() {
      var currentPointedElement = this.getCurrentPointedElement(), objectInstance = this;

      this.Controller.ModalHelper.currentElements.removeClass('active').addClass('inactive');

      this.Controller.ModalHelper.currentElements.unbind('hover').bind('hover', function() {
        objectInstance.Controller.ModalHelper.currentElements.removeClass('active inactive');
      });

      return currentPointedElement;
    },

    getCurrentPointedElement : function() {
      var items = this.Controller.ModalHelper.currentElements;

      return items.filter('.active').length > 0 ? items.filter('.active:first') : false;
    }

  }

};

jQuery(document).ready(function(){

  var mtSelectInstances      = {},
      mtSelectInstancesCount = 0;

  jQuery('.component-mt-select').each(function(){
    if(jQuery(this).hasClass('dispatched'))
      return;

    jQuery(this).addClass('dispatched');

    mtSelectInstances[mtSelectInstancesCount] = jQuery.extend(1, {}, jQueryMTSelect);

    var attributes = {}, params = {};

    jQuery.each( jQuery(this)[0].attributes, function( index, attr ) {
      attributes[ attr.name ] = attr.value;
    } );

    jQuery.each(attributes, function(key, value){
      if(key.indexOf('data-mt-') == 0) {
        var name = key.replace('data-mt-', '');

        name = name.replace(/-/g, '_');

        params[name] = value;
      }
    });

    params.namespace = "mt_select_" + mtSelectInstancesCount;

    mtSelectInstances[mtSelectInstancesCount].Init(jQuery(this), params);

    mtSelectInstancesCount++;
  });

});