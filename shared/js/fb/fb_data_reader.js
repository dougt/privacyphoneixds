'use strict';

// Reader Module for FB Data in a Datastore
// To use this library you need to include 'shared/js/fb/fb_request.js'
// WARNING: This file lazy loads 'shared/js/fb/fb_tel_index.js'

var fb = this.fb || {};
this.fb = fb;

(function() {
  var contacts = fb.contacts || {};
  fb.contacts = contacts;

  var datastore;
  // Datastore name declared on the manifest.webapp
  var DATASTORE_NAME = 'Gaia_Facebook_Friends';
  // Record Id for the index
  var INDEX_ID = 1;

  // Indicates the initialization state
  var readyState = 'notInitialized';
  // Custom event for notifying initializations
  var INITIALIZE_EVENT = 'fb_ds_init';

  // Last known revision Id. Used to determine whether the index has to
  // be reloaded or not
  var revisionId;

  // Creates the internal Object in the datastore that will act as an index
  function createIndex() {
    return {
      // By Facebook UID
      byUid: Object.create(null),
      // By tel number and all its possible variants
      // (We are not supporting dups right now)
      byTel: Object.create(null),
      // Prefix tree for enabling searching by partial tel numbers
      treeTel: Object.create(null)
    };
  }

  // The index we need to keep the correspondance between FB Friends and
  // datastore Ids
  var index;

  function notifyOpenSuccess(cb) {
    readyState = 'initialized';
    if (typeof cb === 'function') {
      window.setTimeout(cb, 0);
    }
    var ev = new CustomEvent(INITIALIZE_EVENT);
    document.dispatchEvent(ev);
  }

  function initError(outRequest, error) {
    outRequest.failed(error);
  }

  // Creates a default handler for errors
  function defaultError(request) {
    return defaultErrorCb.bind(null, request);
  }

  // Creates a default handler for success
  function defaultSuccess(request) {
    return defaultSuccessCb.bind(null, request);
  }

  function defaultErrorCb(request, error) {
    request.failed(error);
  }

  function defaultSuccessCb(request, result) {
    request.done(result);
  }

  function setIndex(obj) {
    index = (obj || createIndex());
  }

  function successGet(outReq, data) {
    outReq.done(data);
  }

  function errorGet(outReq, uid, err) {
    window.console.error('Error while getting object for UID: ', uid);
    outReq.failed(err.name);
  }

  Object.defineProperty(contacts, 'datastore', {
    get: function getDataStore() { return datastore },
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(contacts, 'dsIndex', {
    get: function getIndex() { return index; },
    set: setIndex,
    enumerable: false,
    configurable: false
  });

  /**
   *  Allows to obtain the FB friend information by UID
   *
   *
   */
  contacts.get = function(uid) {
    var outRequest = new fb.utils.Request();

    window.setTimeout(function get() {
      contacts.init(function() {
        doGet(uid, outRequest);
      }, function() {
        initError(outRequest);
      });
    }, 0);

    return outRequest;
  };

  function doGet(uid, outRequest) {
    var dsId;

    var successCb = successGet.bind(null, outRequest);
    var errorCb = errorGet.bind(null, outRequest, uid);

    if (datastore.revisionId !== revisionId) {
      // Refreshing the index just in case
      datastore.get(INDEX_ID).then(function success_index(obj) {
        revisionId = datastore.revisionId;
        setIndex(obj);
        dsId = index.byUid[uid];
        if (typeof dsId !== 'undefined') {
          return datastore.get(dsId);
        }
        else {
          // This is not an error is just that we cannot find it
          outRequest.done(null);
          // Just to avoid warnings of function not always returning
          return null;
        }
      }, errorCb).then(successCb, errorCb);
    }
    else {
      dsId = index.byUid[uid];
      if (typeof dsId === 'number') {
        datastore.get(dsId).then(successCb, errorCb);
      }
      else {
        outRequest.done(null);
      }
    }
  }

  /**
   *  Allows to get FB information by tel number (short or long)
   *  The tel number must be complete
   *
   */
  contacts.getByPhone = function(tel) {
    var outRequest = new fb.utils.Request();

    window.setTimeout(function get_by_phone() {
      contacts.init(function get_by_phone() {
        doGetByPhone(tel, outRequest);
      },
      function() {
        initError(outRequest);
      });
    }, 0);

    return outRequest;
  };

  function doGetByPhone(tel, outRequest) {
    var dsId;
    var normalizedNumber = navigator.mozPhoneNumberService.normalize(tel);
    if (datastore.revisionId !== revisionId) {
      window.console.info('Datastore revision id has changed!');
      // Refreshing the index just in case
      datastore.get(INDEX_ID).then(function success(obj) {
        setIndex(obj);
        revisionId = datastore.revisionId;
        dsId = index.byTel[normalizedNumber];

        if (typeof dsId !== 'undefined') {
          datastore.get(dsId).then(function success(friend) {
            outRequest.done(friend);
          }, defaultError(outRequest));
        }
        else {
          outRequest.done(null);
        }
      }, function(err) {
        window.console.error('The index cannot be refreshed: ', err.name);
        outRequest.failed(err);
      });
    }
    else {
      dsId = index.byTel[normalizedNumber];
      if (typeof dsId !== 'undefined') {
        datastore.get(dsId).then(function success(friend) {
          outRequest.done(friend);
        }, defaultError(outRequest));
      }
      else {
        outRequest.done(null);
      }
    }
  }

  /**
   *  Allows to search for friends by different criteria.
   *  Numbers can be partial and partial matchings will be found
   *
   *  by === tel : By Tel number
   *
   */
  contacts.search = function(by, number) {
    var outRequest = new fb.utils.Request();

    window.setTimeout(function do_search() {
      contacts.init(function do_search_init() {
        if (by === 'phone') {
          doSearchByPhone(number, outRequest);
        }
      },
      function() {
        initError(outRequest);
      });
    }, 0);

    return outRequest;
  };


  function doSearchByPhone(number, outRequest) {
    var normalizedNumber = navigator.mozPhoneNumberService.normalize(number);
    LazyLoader.load('/shared/js/fb/fb_tel_index.js', function() {
      var toSearchNumber = normalizedNumber;
      // TODO: Temporal way of searching for international numbers
      // A follow-up is needed by using PhoneNumber.js exposed to Gaia
      if (number.charAt(0) === '+') {
        toSearchNumber = number.substring(1);
      }
      if (datastore.revisionId !== revisionId) {
        window.console.info('Datastore revision id has changed!');
        // Refreshing the index
        datastore.get(INDEX_ID).then(function success(obj) {
        setIndex(obj);
        revisionId = datastore.revisionId;
        var results = TelIndexer.search(index.treeTel, toSearchNumber);
        var out = null;
        if (results.length > 0) {
          out = datastore.get(results);
        }
        else {
          outRequest.done(results);
        }
        return out;
      },function(err) {
        window.console.error('The index cannot be refreshed: ', err.name);
        outRequest.failed(err);
      }).then(function success(objList) {
          outRequest.done(objList);
      }, function error(err) {
          window.console.error('Error while retrieving result data: ',
                               err.name);
          outRequest.failed(err);
        });
      }
      else {
        var results = TelIndexer.search(index.treeTel, toSearchNumber);

        if (results.length > 0) {
          datastore.get(results).then(function success(objList) {
            outRequest.done(objList);
          }, function error(err) {
             window.console.error('Error while retrieving result data: ',
                                  err.name);
             outRequest.failed(err);
          });
        }
        else {
          outRequest.done(results);
        }
      }
    });
  }

  /**
   *  Refreshes the index data
   *
   */
  contacts.refresh = function() {
    var outRequest = new fb.utils.Request();

     window.setTimeout(function clear() {
      contacts.init(function() {
        doRefresh(outRequest);
      },
      function() {
         initError(outRequest);
      });
    }, 0);

    return outRequest;
  };

  function doRefresh(outRequest) {
    datastore.get(INDEX_ID).then(function success(obj) {
      setIndex(obj);
      outRequest.done();
    }, defaultError(outRequest));
  }

  /**
   *  Allows to obtain how many records contain he FB Database
   *
   */
  contacts.getLength = function() {
    var retRequest = new fb.utils.Request();

    window.setTimeout(function() {
      contacts.init(function get_all() {
        doGetLength(retRequest);
      },
      function() {
        initError(retRequest);
      });
    }, 0);

    return retRequest;
  };


   /**
   *  Allows to return the total number of records in the DataStore (minus 1)
   *  That's because the index object also counts
   *
   */
  function doGetLength(outRequest) {
    datastore.getLength().then(function success(length) {
      outRequest.done(length - 1);
    },
    function error(err) {
      outRequest.failed(err);
    });
  }

  /**
   *  Initialization function
   *
   */
  contacts.init = function(cb, errorCb) {
    if (readyState === 'initialized') {
      cb();
      return;
    }

    if (readyState === 'initializing') {
      document.addEventListener(INITIALIZE_EVENT, function oninitalized() {
        cb();
        document.removeEventListener(INITIALIZE_EVENT, oninitalized);
      });
      return;
    }

    readyState = 'initializing';

    navigator.getDataStores(DATASTORE_NAME).then(function success(ds) {
      if (ds.length < 1) {
        window.console.error('FB: Cannot get access to the DataStore');
         if (typeof errorCb === 'function') {
          errorCb();
        }
        return;
      }

      datastore = ds[0];
      // Checking the length as the index should be there
      datastore.getLength().then(function(length) {
        if (length === 0 && datastore.readOnly === false) {
          window.console.info('Adding index as length is 0');
          setIndex(createIndex());
          return datastore.add(index);
        }
        else if (length > 0) {
          return datastore.get(INDEX_ID);
        }
        else if (datastore.readOnly === true) {
          // Index is created in order not to cause errors
          window.console.warn('The datastore is empty and readonly');
          setIndex(createIndex());
          notifyOpenSuccess(cb);
        }
        return null;
      }).then(function(v) {
        if (typeof v === 'object') {
          setIndex(v);
        }
        revisionId = datastore.revisionId;
        notifyOpenSuccess(cb);
      });
    }, function error() {
      window.console.error('FB: Error while opening the DataStore: ',
                                                      e.target.error.name);
      if (typeof errorCb === 'function') {
        errorCb();
      }
   });
  };
})();
