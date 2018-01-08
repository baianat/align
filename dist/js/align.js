(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Align = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var highlight = createCommonjsModule(function (module, exports) {
/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

(function(factory) {

  // Find the global object for export to both the browser and web workers.
  {
    factory(exports);
  }

}(function(hljs) {
  // Convenience variables for build-in objects
  var ArrayProto = [],
      objectKeys = Object.keys;

  // Global internal variables used within the highlight.js library.
  var languages = {},
      aliases   = {};

  // Regular expressions used throughout the highlight.js library.
  var noHighlightRe    = /^(no-?highlight|plain|text)$/i,
      languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
      fixMarkupRe      = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

  var spanEndTag = '</span>';

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };


  /* Utility functions */

  function escape(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }

  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }

  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    match = languagePrefixRe.exec(classes);
    if (match) {
      return getLanguage(match[1]) ? match[1] : 'no-highlight';
    }

    classes = classes.split(/\s+/);

    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];

      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }

  function inherit(parent) {  // inherit(parent, override_obj, override_obj, ...)
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);

    for (key in parent)
      { result[key] = parent[key]; }
    objects.forEach(function(obj) {
      for (key in obj)
        { result[key] = obj[key]; }
    });
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3)
          { offset += child.nodeValue.length; }
        else if (child.nodeType === 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
      return highlighted[0].event === 'start' ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value).replace('"', '&quot;') + '"';}
      result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join('') + '>';
    }

    function close(node) {
      result += '</' + tag(node) + '>';
    }

    function render(event) {
      (event.event === 'start' ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream === original && stream.length && stream[0].offset === processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function expand_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function(variant) {
        return inherit(mode, {variants: null}, variant);
      });
    }
    return mode.cached_variants || (mode.endsWithParent && [inherit(mode)]) || [mode];
  }

  function compileLanguage(language) {

    function reStr(re) {
        return (re && re.source) || re;
    }

    function langRe(value, global) {
      return new RegExp(
        reStr(value),
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      );
    }

    function compileMode(mode, parent) {
      if (mode.compiled)
        { return; }
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords) {
        var compiled_keywords = {};

        var flatten = function(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase();
          }
          str.split(' ').forEach(function(kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
          });
        };

        if (typeof mode.keywords === 'string') { // string
          flatten('keyword', mode.keywords);
        } else {
          objectKeys(mode.keywords).forEach(function (className) {
            flatten(className, mode.keywords[className]);
          });
        }
        mode.keywords = compiled_keywords;
      }
      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
        }
        if (!mode.begin)
          { mode.begin = /\B|\b/; }
        mode.beginRe = langRe(mode.begin);
        if (!mode.end && !mode.endsWithParent)
          { mode.end = /\B|\b/; }
        if (mode.end)
          { mode.endRe = langRe(mode.end); }
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end)
          { mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end; }
      }
      if (mode.illegal)
        { mode.illegalRe = langRe(mode.illegal); }
      if (mode.relevance == null)
        { mode.relevance = 1; }
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function(c) {
        return expand_mode(c === 'self' ? mode : c)
      }));
      mode.contains.forEach(function(c) {compileMode(c, mode);});

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators =
        mode.contains.map(function(c) {
          return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
        })
        .concat([mode.terminator_end, mode.illegal])
        .map(reStr)
        .filter(Boolean);
      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(/*s*/) {return null;}};
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(name, value, ignore_illegals, continuation) {

    function subMode(lexeme, mode) {
      var i, length;

      for (i = 0, length = mode.contains.length; i < length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      var classPrefix = noPrefix ? '' : options.classPrefix,
          openSpan    = '<span class="' + classPrefix,
          closeSpan   = leaveOpen ? '' : spanEndTag;

      openSpan += classname + '">';

      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      var keyword_match, last_index, match, result;

      if (!top.keywords)
        { return escape(mode_buffer); }

      result = '';
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match = top.lexemesRe.exec(mode_buffer);

      while (match) {
        result += escape(mode_buffer.substring(last_index, match.index));
        keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }

    function processSubLanguage() {
      var explicit = typeof top.subLanguage === 'string';
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }

      var result = explicit ?
                   highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) :
                   highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      result += (top.subLanguage != null ? processSubLanguage() : processKeywords());
      mode_buffer = '';
    }

    function startNewMode(mode) {
      result += mode.className? buildSpan(mode.className, '', true): '';
      top = Object.create(mode, {parent: {value: top}});
    }

    function processLexeme(buffer, lexeme) {

      mode_buffer += buffer;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      var new_mode = subMode(lexeme, top);
      if (new_mode) {
        if (new_mode.skip) {
          mode_buffer += lexeme;
        } else {
          if (new_mode.excludeBegin) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
            mode_buffer = lexeme;
          }
        }
        startNewMode(new_mode, lexeme);
        return new_mode.returnBegin ? 0 : lexeme.length;
      }

      var end_mode = endOfMode(top, lexeme);
      if (end_mode) {
        var origin = top;
        if (origin.skip) {
          mode_buffer += lexeme;
        } else {
          if (!(origin.returnEnd || origin.excludeEnd)) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (origin.excludeEnd) {
            mode_buffer = lexeme;
          }
        }
        do {
          if (top.className) {
            result += spanEndTag;
          }
          if (!top.skip) {
            relevance += top.relevance;
          }
          top = top.parent;
        } while (top !== end_mode.parent);
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '');
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }

      if (isIllegal(lexeme, top))
        { throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"'); }

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme;
      return lexeme.length || 1;
    }

    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = '', current;
    for(current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result;
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match)
          { break; }
        count = processLexeme(value.substring(index, match.index), match[0]);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for(current = top; current.parent; current = current.parent) { // close dangling modes
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance: relevance,
        value: result,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message && e.message.indexOf('Illegal') !== -1) {
        return {
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text, languageSubset) {
    languageSubset = languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset.filter(getLanguage).forEach(function(name) {
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value) {
    return !(options.tabReplace || options.useBR)
      ? value
      : value.replace(fixMarkupRe, function(match, p1) {
          if (options.useBR && match === '\n') {
            return '<br>';
          } else if (options.tabReplace) {
            return p1.replace(/\t/g, options.tabReplace);
          }
          return '';
      });
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
        result   = [prevClassName.trim()];

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs');
    }

    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }

    return result.join(' ').trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);

    if (isNotHighlighted(language))
        { return; }

    if (options.useBR) {
      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);

    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called)
      { return; }
    initHighlighting.called = true;

    var blocks = document.querySelectorAll('pre code');
    ArrayProto.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false);
    addEventListener('load', initHighlighting, false);
  }

  function registerLanguage(name, language) {
    var lang = languages[name] = language(hljs);
    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
    }
  }

  function listLanguages() {
    return objectKeys(languages);
  }

  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.inherit = inherit;

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*';
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  };
  hljs.COMMENT = function (begin, end, inherits) {
    var mode = hljs.inherit(
      {
        className: 'comment',
        begin: begin, end: end,
        contains: []
      },
      inherits || {}
    );
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: 'doctag',
      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE + '(' +
      '%|em|ex|ch|rem'  +
      '|vw|vh|vmin|vmax' +
      '|cm|mm|in|pt|pc|px' +
      '|deg|grad|rad|turn' +
      '|s|ms' +
      '|Hz|kHz' +
      '|dpi|dpcm|dppx' +
      ')?',
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//, end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        begin: /\[/, end: /\]/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };

  return hljs;
}));
});

var javascript = function(hljs) {
  var IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var KEYWORDS = {
    keyword:
      'in of if for while finally var new function do return void else break catch ' +
      'instanceof with throw case default try this switch continue typeof delete ' +
      'let yield const export super debugger as async await static ' +
      // ECMAScript 6 modules import
      'import from as'
    ,
    literal:
      'true false null undefined NaN Infinity',
    built_in:
      'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
      'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
      'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
      'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
      'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
      'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
      'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' +
      'Promise'
  };
  var NUMBER = {
    className: 'number',
    variants: [
      { begin: '\\b(0[bB][01]+)' },
      { begin: '\\b(0[oO][0-7]+)' },
      { begin: hljs.C_NUMBER_RE }
    ],
    relevance: 0
  };
  var SUBST = {
    className: 'subst',
    begin: '\\$\\{', end: '\\}',
    keywords: KEYWORDS,
    contains: []  // defined later
  };
  var TEMPLATE_STRING = {
    className: 'string',
    begin: '`', end: '`',
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  SUBST.contains = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    TEMPLATE_STRING,
    NUMBER,
    hljs.REGEXP_MODE
  ];
  var PARAMS_CONTAINS = SUBST.contains.concat([
    hljs.C_BLOCK_COMMENT_MODE,
    hljs.C_LINE_COMMENT_MODE
  ]);

  return {
    aliases: ['js', 'jsx'],
    keywords: KEYWORDS,
    contains: [
      {
        className: 'meta',
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      },
      {
        className: 'meta',
        begin: /^#!/, end: /$/
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      TEMPLATE_STRING,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBER,
      { // object attr container
        begin: /[{,]\s*/, relevance: 0,
        contains: [
          {
            begin: IDENT_RE + '\\s*:', returnBegin: true,
            relevance: 0,
            contains: [{className: 'attr', begin: IDENT_RE, relevance: 0}]
          }
        ]
      },
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE,
          {
            className: 'function',
            begin: '(\\(.*?\\)|' + IDENT_RE + ')\\s*=>', returnBegin: true,
            end: '\\s*=>',
            contains: [
              {
                className: 'params',
                variants: [
                  {
                    begin: IDENT_RE
                  },
                  {
                    begin: /\(\s*\)/,
                  },
                  {
                    begin: /\(/, end: /\)/,
                    excludeBegin: true, excludeEnd: true,
                    keywords: KEYWORDS,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          { // E4X / JSX
            begin: /</, end: /(\/\w+|\w+\/)>/,
            subLanguage: 'xml',
            contains: [
              {begin: /<\w+\s*\/>/, skip: true},
              {
                begin: /<\w+/, end: /(\/\w+|\w+\/)>/, skip: true,
                contains: [
                  {begin: /<\w+\s*\/>/, skip: true},
                  'self'
                ]
              }
            ]
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /\{/, excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: IDENT_RE}),
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            contains: PARAMS_CONTAINS
          }
        ],
        illegal: /\[|%/
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      hljs.METHOD_GUARD,
      { // ES6 class
        className: 'class',
        beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
        illegal: /[:"\[\]]/,
        contains: [
          {beginKeywords: 'extends'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      {
        beginKeywords: 'constructor', end: /\{/, excludeEnd: true
      }
    ],
    illegal: /#(?!!)/
  };
};

/**
 * Utilities
 */
function select(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}

















/**
 * Converts an array-like object to an array.
 */

var colorpicker = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

var commonjsGlobal$$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};





function createCommonjsModule$$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var slider$1 = createCommonjsModule$$1(function (module, exports) {
(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal$$1, (function () { 'use strict';

/**
 * Utilities
 */
function select(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}

















function getNumber(number1, number2) {
  return number1 ? parseInt(number1, 10) : parseInt(number2, 10);
}





function wrap(el, wrapper) {
  // insert wrapper before el in the DOM tree
  el.parentNode.insertBefore(wrapper, el);

  // move el into wrapper
  wrapper.appendChild(el);
}

/**
 * Converts an array-like object to an array.
 */

/**
 * Slider class
 */
var Slider = function Slider(selector, ref) {
  if ( ref === void 0 ) { ref = {}; }
  var gradient = ref.gradient; if ( gradient === void 0 ) { gradient = null; }
  var classes = ref.classes; if ( classes === void 0 ) { classes = null; }
  var colorCode = ref.colorCode; if ( colorCode === void 0 ) { colorCode = false; }
  var editable = ref.editable; if ( editable === void 0 ) { editable = false; }
  var reverse = ref.reverse; if ( reverse === void 0 ) { reverse = false; }
  var label = ref.label; if ( label === void 0 ) { label = true; }
  var min = ref.min; if ( min === void 0 ) { min = 0; }
  var max = ref.max; if ( max === void 0 ) { max = 10; }
  var step = ref.step; if ( step === void 0 ) { step = 1; }
  var value = ref.value; if ( value === void 0 ) { value = 0; }

  this.el = select(selector);
  this.settings = {
    gradient: gradient,
    classes: classes,
    colorCode: colorCode,
    editable: editable,
    reverse: reverse,
    label: label,
    min: min,
    max: max,
    step: step,
    value: value
  };
  this.init();
};

/**
 * create new rang slider element
 * @param {String|HTMLElement} selector
 * @param {Object}           settings
 */
Slider.create = function create (selector, settings) {
  Slider(selector, settings);
};

Slider.prototype.init = function init () {
  this.initElements();

  this.min = getNumber(this.el.min, this.settings.min);
  this.max = getNumber(this.el.max, this.settings.max);
  this.step = getNumber(this.el.step, this.settings.step);
  this.callbacks = {};

  if (this.settings.gradient) { this.initGradient(); }

  this.updateWidth();
  this.update(getNumber(this.el.value, this.settings.value));
  this.initEvents();
};

Slider.prototype.initElements = function initElements () {
  this.wrapper = document.createElement('div');
  this.track = document.createElement('div');
  this.handle = document.createElement('div');
  this.fill = document.createElement('div');

  this.wrapper.classList.add('slider');
  if (this.settings.editable) {
    this.wrapper.classList.add('is-editable');
  }
  if (this.settings.reverse) {
    this.wrapper.classList.add('is-reverse');
  }
  if (this.settings.classes) {
    this.wrapper.classList.add(this.settings.classes);
  }
  this.track.classList.add('slider-track');
  this.handle.classList.add('slider-handle');
  this.fill.classList.add('slider-fill');
  this.el.classList.add('input', 'is-tiny');

  wrap(this.el, this.wrapper);
  this.track.appendChild(this.fill);
  this.track.appendChild(this.handle);
  this.wrapper.appendChild(this.track);
  if (this.settings.label) {
    this.label = document.createElement('div');
    this.label.classList.add('slider-label');
    this.handle.appendChild(this.label);
  }
};

Slider.prototype.initGradient = function initGradient () {
  if (this.settings.gradient.length > 1) {
    this.track.style.backgroundImage = "linear-gradient(90deg, " + (this.settings.gradient) + ")";
    this.gradient = this.settings.gradient;
    this.colorCode = this.settings.colorCode;
    return;
  }
  this.track.style.backgroundImage = 'none';
  this.track.style.backgroundColor = this.settings.gradient[0];
  this.handle.style.backgroundColor = this.settings.gradient[0];
  this.gradient = null;
};

Slider.prototype.initEvents = function initEvents () {
    var this$1 = this;

  this.track.addEventListener('mousedown', this.select.bind(this), false);
  this.track.addEventListener('touchstart', this.select.bind(this), false);
  if (this.settings.editable && !this.settings.colorCode) {
    this.el.addEventListener('change', function (evt) {
      this$1.update(this$1.el.value);
    }, false);
  }
};

/**
 * fire select events
 */
Slider.prototype.select = function select$$1 (event) {
  event.preventDefault();
  this.updateWidth();
  this.click(event);
  this.callbacks.tempDrag = this.dragging.bind(this);
  this.callbacks.tempRelease = this.release.bind(this);
  document.addEventListener('mousemove', this.callbacks.tempDrag, false);
  document.addEventListener('touchmove', this.callbacks.tempDrag, false);
  document.addEventListener('touchend', this.callbacks.tempRelease, false);
  document.addEventListener('mouseup', this.callbacks.tempRelease, false);
};

/**
 * dragging motion
 */
Slider.prototype.dragging = function dragging (event) {
  event.preventDefault();
  // get drag change value
  var eventX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
  var mouseValue = (eventX - this.currentX);

  // check ifleft mouse is clicked
  if (event.buttons !== 1 && event.type === 'mousemove') { return; }
  this.track.classList.add('is-dragging');
  var stepCount = parseInt((mouseValue / this.stepWidth) + 0.5, 10);
  var stepValue = parseInt((stepCount + this.min) / this.step, 10) * this.step;
  if (stepValue !== this.currentValue) {
    this.update(stepValue);
  }
};

/**
 * release handler
 */
Slider.prototype.release = function release () {
  this.track.classList.remove('is-dragging');
  document.removeEventListener('mousemove', this.callbacks.tempDrag);
  document.removeEventListener('touchmove', this.callbacks.tempDrag);
  document.removeEventListener('mouseup', this.callbacks.tempRelease);
  document.removeEventListener('touchend', this.callbacks.tempRelease);
};

Slider.prototype.click = function click (event) {
  event.preventDefault();
  var eventX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;
  var mouseValue = (eventX - this.currentX);

  // check ifleft mouse is clicked
  if (event.buttons !== 1 && event.type === 'mousemove') { return; }
  var stepCount = parseInt((mouseValue / this.stepWidth) + 0.5, 10);
  var stepValue = parseInt((stepCount + this.min) / this.step, 10) * this.step;
  if (stepValue !== this.currentValue) {
    this.update(stepValue);
  }
};

Slider.prototype.updateWidth = function updateWidth () {
  this.currentX = this.track.getBoundingClientRect().left;
  this.width = this.track.clientWidth;
  this.stepWidth = (this.width / (this.max - this.min));
};

/**
 * get the filled area percentage
 * @param{Object} slider
 * @param{Number} value
 * @return {Number}
 */
Slider.prototype.getFillPercentage = function getFillPercentage (value) {
  return ((value - this.min) * 100) / (this.max - this.min);
};

Slider.prototype.normalizeValue = function normalizeValue (value) {
  if (value >= this.max) {
    return this.max;
  }
  if (value <= this.min) {
    return this.min;
  }
  if (isNaN(Number(value))) {
    return this.value;
  }
  return Number(value);
};

Slider.prototype.newGradient = function newGradient (newGradient$1) {
  this.settings.gradient = newGradient$1;
  this.initGradient();
  this.update(undefined, true);
};

/**
 * get the handle color
 * @param{Number} fillPercentage
 * @return {Number}              handle hex color code
 */
Slider.prototype.getHandleColor = function getHandleColor (fillPercentage) {
    var this$1 = this;

  var colorCount = this.gradient.length - 1;
  var region = fillPercentage / 100;
  for (var i = 1; i <= colorCount; i++) {
    // check the current zone
    if (region >= ((i - 1) / colorCount) && region <= (i / colorCount)) {
      // get the active color percentage
      var colorPercentage = (region - ((i - 1) / colorCount)) / (1 / colorCount);
      // return the mixed color based on the zone boundary colors
      return Slider.mixColors(this$1.gradient[i - 1],
        this$1.gradient[i], colorPercentage);
    }
  }
  return '#000000';
};

/**
 * update the slider fill, value and color
 * @param {Number} value
 */
Slider.prototype.update = function update (value, mute) {
    if ( mute === void 0 ) { mute = false; }

  if (Number(value) === this.value) { return; }
  var normalized = this.normalizeValue(value);

  var fillPercentage = this.getFillPercentage(normalized);

  this.handle.style.left = fillPercentage + "%";
  this.fill.style.left = fillPercentage + "%";

  this.value = normalized;
  this.el.value = this.value;
  if (this.settings.label) {
    this.label.innerHTML = this.value;
  }
  if (this.gradient) {
    var color = this.getHandleColor(fillPercentage);
    this.handle.style.backgroundColor = color;
    if (this.settings.colorCode) {
      this.el.value = color;
      this.label.innerHTML = color;
    }
  }
  if (mute) { return; }
  this.el.dispatchEvent(new Event('change'));
  this.el.dispatchEvent(new Event('input'));
};

/**
 * private functions
 */
Slider.hexAverage = function hexAverage (color1, color2, ratio) {
    if ( ratio === void 0 ) { ratio = 0.5; }

  var average = (parseInt(color1, 16) * (1 - ratio)) + (parseInt(color2, 16) * ratio);
  return (("00" + (Math.floor(average + 0.5).toString(16)))).slice(-2);
};

Slider.mixColors = function mixColors (color1, color2, ratio) {
  color1 = color1.replace('#', '');
  color2 = color2.replace('#', '');
  var red = Slider.hexAverage(color1.slice(0, -4), color2.slice(0, -4), ratio);
  var green = Slider.hexAverage(color1.slice(2, -2), color2.slice(2, -2), ratio);
  var blue = Slider.hexAverage(color1.slice(-2), color2.slice(-2), ratio);
  return ("#" + ((red + green + blue).toUpperCase()));
};

return Slider;

})));
});

function polyfill() {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;
      if (!document.documentElement.contains(el)) { return null; }
      do {
        if (el.matches(s)) { return el; }
        el = el.parentElement;
      } while (el !== null);
      return null;
    };
  }
}

/**
 * Utilities
 */
function select(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}





function call(func) {
  if (typeof func === 'function') {
    func();
  }
}









function getArray(length, value) {
  var array = [];
  for (var i = 0; i < length; i++) {
    var temp = typeof value === 'function' ? value() : value;
    array.push(temp);
  }
  return array;
}









/**
 * Converts an array-like object to an array.
 */


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeColorValue(value) {
  if (value > 255) {
    return 255;
  }
  if (value < 0) {
    return 0;
  }
  return value;
}

function getHexValue(value) {
  if (isNaN(Number(value))) {
    return '00';
  }
  return ('0' + Number(value).toString(16)).slice(-2);
}

function getDecimalValue(value) {
  if (isNaN(parseInt(value, 16))) {
    return '0';
  }
  return parseInt(value, 16);
}

function getRandomColor() {
  return ("rgb(" + (getRandomInt(0, 255)) + ", " + (getRandomInt(0, 255)) + ", " + (getRandomInt(0, 255)) + ")")
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? '#' +
    ('0' + parseInt(normalizeColorValue(rgb[1]), 10).toString(16)).slice(-2) +
    ('0' + parseInt(normalizeColorValue(rgb[2]), 10).toString(16)).slice(-2) +
    ('0' + parseInt(normalizeColorValue(rgb[3]), 10).toString(16)).slice(-2) : '';
}

function rgb2hsl(rgb) {
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  if (!rgb || rgb.length !== 4) { return; }

  // Convert the RGB values to the range 0-1
  var red = rgb[1] / 255;
  var green = rgb[2] / 255;
  var blue = rgb[3] / 255;
  var Hue = 0;
  var Sat = 0;
  var Lum = 0;

  //Find the minimum and maximum values of R, G and B.
  var min = Math.min(red, green, blue);
  var max = Math.max(red, green, blue);

  //Calculate the Luminace value
  Lum = (min + max) / 2;

  //Calculate the Saturation.
  if (min !== max) {
    Sat = Lum > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }

  //calculate the Hue
  if (red >= max && min !== max) {
    Hue = 60 * ((green - blue) / (max - min));
  }
  if (green >= max && min !== max) {
    Hue = 60 * (2.0 + (blue - red) / (max - min));
  }
  if (blue >= max && min !== max) {
    Hue = 60 * (4.0 + (red - green) / (max - min));
  }

  // normalize values 
  Hue = Hue < 0 ? parseInt(Hue + 360) : parseInt(Hue);
  Sat = parseInt(Sat * 100);
  Lum = parseInt(Lum * 100);

  return ("hsl(" + Hue + ", " + Sat + "%, " + Lum + "%)");
}

function getCartesianCoords(r, θ) {
  return { x: r * Math.cos(θ * Math.PI * 2), y: r * Math.sin(θ * Math.PI * 2) }
}

var Colorpicker = function Colorpicker(selector, ref) {
  if ( ref === void 0 ) { ref = {}; }
  var defaultColor = ref.defaultColor; if ( defaultColor === void 0 ) { defaultColor = getRandomColor(); }
  var radius = ref.radius; if ( radius === void 0 ) { radius = 200; }
  var mode = ref.mode; if ( mode === void 0 ) { mode = 'rgb'; }
  var events = ref.events; if ( events === void 0 ) { events = {}; }
  var recentColors = ref.recentColors; if ( recentColors === void 0 ) { recentColors = getArray(6, getRandomColor); }

  this.el = select(selector);
  this.options = {
    defaultColor: defaultColor,
    radius: radius,
    mode: mode,
    events: events,
    recentColors: recentColors
  };
  this.init();
};

Colorpicker.prototype.init = function init () {
  this.recentColors = this.options.recentColors;
  this.lastMove = { x: 0, y: 0 };
  this.isMenuActive = false;
  polyfill();
  this._initElements();
  this._initWheel();
  this._initEvents();
  this.selectColor(this.options.defaultColor, true);
};

Colorpicker.prototype._initElements = function _initElements () {
    var this$1 = this;

  // create elements and config them
  this.picker = document.createElement('div');
  this.picker.insertAdjacentHTML('afterbegin', "\n      <button class=\"picker-guide\"></button>\n      <div class=\"modal is-inverse picker-menu is-hidden\" tabindex=\"-1\">\n        <div class=\"modal-body\">\n          <div class=\"picker-wheel\">\n            <canvas class=\"picker-canvas\"></canvas>\n            <div class=\"picker-cursor\"></div>\n          </div>\n          <input class=\"picker-saturation\" type=\"number\" min=\"0\" max=\"100\" value=\"100\">\n\n          <input id=\"red\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n          <input id=\"green\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n          <input id=\"blue\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n          <div class=\"form has-itemAfter is-tiny\">\n            <button class=\"button picker-submit\">\n              <svg class=\"icon\" viewBox=\"0 0 24 24\">\n                <path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\"/>\n              </svg>\n            </button>\n          </div>\n          <div class=\"picker-recent\"></div>\n        </div>\n      </div>\n    ");

  this.menu = this.picker.querySelector('.picker-menu');
  this.body = this.picker.querySelector('.modal-body');
  this.recent = this.picker.querySelector('.picker-recent');
  this.guide = this.picker.querySelector('.picker-guide');
  this.canvas = this.picker.querySelector('.picker-canvas');
  this.wheel = this.picker.querySelector('.picker-wheel');
  this.submit = this.picker.querySelector('.picker-submit');
  this.cursor = this.picker.querySelector('.picker-cursor');
  this.saturation = this.picker.querySelector('.picker-saturation');
  this.rgbSliders = {
    red: this.picker.querySelector('#red'),
    green: this.picker.querySelector('#green'),
    blue: this.picker.querySelector('#blue')
  };

  this.el.parentNode.insertBefore(this.picker, this.el);
  this.el.classList.add('picker-value', 'input');
  this.picker.classList.add('picker');
  this.submit.parentNode.insertBefore(this.el, this.submit);
  this.guide.style.backgroundColor = this.options.defaultColor;

  this.sliders = {};
  this.sliders.saturation = new slider$1(this.saturation, {
    gradient: ['#FFFFFF', '#000000'],
    label: false
  });
  Object.keys(this.rgbSliders).forEach(function (key) {
    this$1.sliders[key] = new slider$1(this$1.rgbSliders[key], {
      gradient: ['#000000', '#FFFFFF'],
      label: false,
      editable: true,
      reverse: true
    });
  });

  this.recentColors.forEach(function (color) {
    var recentColor = document.createElement('a');
    recentColor.classList.add('picker-color');
    recentColor.style.backgroundColor = color;
    this$1.recent.appendChild(recentColor);
    recentColor.addEventListener('mousedown', function (event) { return event.preventDefault(); });
    recentColor.addEventListener('click', function (event) { return this$1.selectColor(color); });
  });
};

Colorpicker.prototype._initWheel = function _initWheel () {
  // setup canvas
  this.canvas.width = this.options.radius;
  this.canvas.height = this.options.radius;
  this.context = this.canvas.getContext('2d');

  // draw wheel circle path
  this.circle = {
    path: new Path2D(),
    xCords: this.canvas.width / 2,
    yCords: this.canvas.height / 2,
    radius: this.canvas.width / 2
  };
  this.circle.path.moveTo(this.circle.xCords, this.circle.yCords);
  this.circle.path.arc(
    this.circle.xCords,
    this.circle.yCords,
    this.circle.radius,
    0,
    360
  );
  this.circle.path.closePath();
  this.updateWheelColors();
};

Colorpicker.prototype._initEvents = function _initEvents () {
    var this$1 = this;

  this.events = [new Event('input'), new Event('change')];

  this.guide.addEventListener('click', function () {
    call(this$1.options.events.beforerOpen);
    this$1.togglePicker();
  });

  this.menu.addEventListener('mousedown', function (event) {
    if (event.target !== this$1.body || event.button !== 0) { return; }
    var startPosition = {};
    var endPosition = {};
    var delta = {};

    event.preventDefault();
    startPosition.x = event.clientX;
    startPosition.y = event.clientY;

    var mousemoveHandler = function (evnt) {
      endPosition.x = evnt.clientX;
      endPosition.y = evnt.clientY;
      delta.x = this$1.lastMove.x + endPosition.x - startPosition.x;
      delta.y = this$1.lastMove.y + endPosition.y - startPosition.y;
      this$1.menu.style.transform = "translate(" + (delta.x) + "px, " + (delta.y) + "px)";
    };
    var mouseupHandler = function () {
      this$1.lastMove = delta;
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  });

  this.wheel.addEventListener('mousedown', function (event) {
    event.preventDefault();
    var updateColor = function (evnt) {
      // check if mouse outside the wheel
      var mouse = this$1.getMouseCords(evnt);
      if (this$1.context.isPointInPath(this$1.circle.path, mouse.x, mouse.y)) {
        var color = this$1.getColorFromWheel(mouse);
        this$1.selectColor(color, false, mouse);

        return color;
      }
      return this$1.el.value;
    };
    var mouseupHandler = function (evnt) {
      var color = updateColor(evnt);
      if (color !== this$1.el.value) {
        this$1.updateRecentColors(color);
        this$1.selectColor(color, false, this$1.mouse);
      }
      document.removeEventListener('mousemove', updateColor);
      document.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mousemove', updateColor);
    document.addEventListener('mouseup', mouseupHandler);
  });

  this.saturation.addEventListener('change', function () {
    this$1.updateWheelColors();
  });

  Object.keys(this.rgbSliders).forEach(function (key) {
    this$1.rgbSliders[key].addEventListener('change', function (event) {
      var color = this$1.getColorFromSliders();
      this$1.selectColor(color);
    });
  });

  this.el.addEventListener('focus', function (event) {
    var edit = function () {
      this$1.selectColor(this$1.el.value, true);
    };
    var release = function () {
      this$1.el.removeEventListener('change', edit);
      this$1.el.removeEventListener('blur', release);
    };
    this$1.el.addEventListener('change', edit);
    this$1.el.addEventListener('blur', release);
  });

  this.submit.addEventListener('click', function (event) {
    call(this$1.options.events.beforeSubmit);
    this$1.selectColor(this$1.el.value);
    this$1.closePicker();
    call(this$1.options.events.afterSubmit);
  });
};

Colorpicker.prototype.updateWheelColors = function updateWheelColors () {
    var this$1 = this;

  var x = this.circle.xCords;
  var y = this.circle.yCords;
  var radius = this.circle.radius;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  for (var angle = 0; angle < 360; angle += 1) {
    var gradient = this$1.context.createRadialGradient(x, y, 0, x, y, radius);
    var startAngle = (angle - 2) * Math.PI / 180;
    var endAngle = (angle + 2) * Math.PI / 180;

    this$1.context.beginPath();
    this$1.context.moveTo(x, y);
    this$1.context.arc(x, y, radius, startAngle, endAngle);
    this$1.context.closePath();
    gradient.addColorStop(0, ("hsl(" + angle + ", " + (this$1.saturation.value) + "%, 100%)"));
    gradient.addColorStop(0.5, ("hsl(" + angle + ", " + (this$1.saturation.value) + "%, 50%)"));
    gradient.addColorStop(1, ("hsl(" + angle + ", " + (this$1.saturation.value) + "%, 0%)"));
    this$1.context.fillStyle = gradient;
    this$1.context.fill();
  }
};

Colorpicker.prototype.updateRecentColors = function updateRecentColors (newColor) {
    var this$1 = this;

  // update recent color array
  if (this.recentColors.length >= 6) {
    this.recentColors.shift();
  }
  if (newColor) {
    this.recentColors.push(newColor);
  }

  // update recent colors buttons
  if (this.recent.childNodes.length >= 6) {
    this.recent.removeChild(this.recent.firstChild);
  }
  var recentColor = document.createElement('a');
  recentColor.classList.add('picker-color');
  recentColor.style.backgroundColor = newColor;
  this.recent.appendChild(recentColor);
  recentColor.addEventListener('click', function (event) {
    event.preventDefault();
    this$1.selectColor(newColor);
  });
};

Colorpicker.prototype.updateSlidersInputs = function updateSlidersInputs (slider) {
  var red = getHexValue(this.rgbSliders.red.value);
  var green = getHexValue(this.rgbSliders.green.value);
  var blue = getHexValue(this.rgbSliders.blue.value);
  this.sliders.red.newGradient([("#00" + green + blue), ("#ff" + green + blue)]);
  this.sliders.green.newGradient([("#" + red + "00" + blue), ("#" + red + "ff" + blue)]);
  this.sliders.blue.newGradient([("#" + red + green + "00"), ("#" + red + green + "ff")]);
};

Colorpicker.prototype.updateCursor = function updateCursor (mouse) {
  var rgbColor = this.getColorFromSliders();
  var hexColor = rgb2hex(rgbColor);
  var hslColor = rgb2hsl(rgbColor);
  var hsl = hslColor.match(/^hsl?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)\%[\s+]?,[\s+]?(\d+)\%[\s+]?/i);
  var r = (100 - hsl[3]) * (this.options.radius / 200);
  var coords = getCartesianCoords(r, hsl[1] / 360);
  var ratio = this.options.radius / 2;
  this.sliders.saturation.update(hsl[2]);
  this.sliders.saturation.newGradient(['#FFFFFF', hexColor]);
  this.cursor.style.backgroundColor = hslColor;
  if (mouse) {
    this.cursor.style.transform = "translate(" + (mouse.x) + "px, " + (mouse.y) + "px)";
    return;
  }
  this.cursor.style.transform = "translate(" + (coords.x + ratio) + "px, " + (coords.y + ratio) + "px)";
};

Colorpicker.prototype.selectColor = function selectColor (color, mute, mouse) {
    var this$1 = this;
    if ( mute === void 0 ) { mute = false; }

  if (color.slice(0, 1) !== '#' &&
      color.slice(0, 3).toUpperCase() !== 'RGB' &&
      color.slice(0, 3).toUpperCase() !== 'HSL') { return; }
  call(this.options.events.beforeSelect);
  var hexColor = color.slice(0, 1) === '#' ? color : rgb2hex(color);
  var hslColor = rgb2hsl(color);
  this.el.value =
    this.options.mode === 'hex' ? hexColor
      : this.options.mode === 'hsl' ? hslColor
        : color;
  this.guide.style.backgroundColor = color;
  this.sliders.red.update(getDecimalValue(hexColor.slice(1, 3)), true);
  this.sliders.green.update(getDecimalValue(hexColor.slice(3, 5)), true);
  this.sliders.blue.update(getDecimalValue(hexColor.slice(5, 7)), true);
  this.updateSlidersInputs();
  this.updateCursor(mouse);
  call(this.options.events.afterSelect);
  if (mute) { return; }
  this.events.forEach(function (event) { return this$1.el.dispatchEvent(event); });
};

Colorpicker.prototype.getColorFromSliders = function getColorFromSliders () {
  var red = this.rgbSliders.red.value;
  var green = this.rgbSliders.green.value;
  var blue = this.rgbSliders.blue.value;
  return ("rgb(" + red + ", " + green + ", " + blue + ")");
};

Colorpicker.prototype.getColorFromWheel = function getColorFromWheel (mouse) {
  var imageData = this.context.getImageData(mouse.x, mouse.y, 1, 1).data;
  return ("rgb(" + (imageData[0]) + ", " + (imageData[1]) + ", " + (imageData[2]) + ")"); 
};

Colorpicker.prototype.getMouseCords = function getMouseCords (evnt) {
  var rect = this.canvas.getBoundingClientRect();
  var mouse = {
    x: evnt.clientX - rect.left,
    y: evnt.clientY - rect.top
  };
  this.mouse = mouse;
  return mouse;
};

Colorpicker.prototype.togglePicker = function togglePicker () {
  if (this.isMenuActive) {
    this.closePicker();
    return;
  }
  this.openPiker();
};

Colorpicker.prototype.closePicker = function closePicker () {
  this.menu.classList.add('is-hidden');
  this.isMenuActive = false;
  document.onclick = '';
};

Colorpicker.prototype.openPiker = function openPiker () {
    var this$1 = this;

  this.menu.classList.remove('is-hidden');
  this.isMenuActive = true;
  document.onclick = function (evnt) {
    if (!evnt.target.closest('.picker-menu') && evnt.target !== this$1.guide) {
      this$1.closePicker();
      return;
    }
    call(this$1.options.events.clicked);
  };
  call(this.options.events.afterOpen);
};

return Colorpicker;

})));
});

var SELECTION = null;

var formats = {
  bold: {
    element: 'button',
    command: 'bold'
  },

  italic: {
    element: 'button',
    command: 'italic'
  },

  underline: {
    element: 'button',
    command: 'underline'
  },

  strikeThrough: {
    element: 'button',
    command: 'strikeThrough'
  },

  removeFormat: {
    element: 'button',
    command: 'removeFormat'
  },

  justifyLeft: {
    element: 'button',
    command: 'justifyLeft'
  },

  justifyCenter: {
    element: 'button',
    command: 'justifyCenter'
  },

  justifyRight: {
    element: 'button',
    command: 'justifyRight'
  },

  justifyFull: {
    element: 'button',
    command: 'justifyFull'
  },

  h1: {
    element: 'button',
    command: 'formatblock',
    value: 'h1'
  },

  h2: {
    element: 'button',
    command: 'formatblock',
    value: 'h2'
  },

  blockquote: {
    element: 'button',
    command: 'formatblock',
    value: 'blockquote'
  },

  p: {
    element: 'button',
    command: 'formatblock',
    value: 'p'
  },

  pre: {
    element: 'button',
    command: 'formatblock',
    value: 'pre'
  },

  html: {
    element: 'button',
    func: 'toggleHTML'
  },
  
  fontSize: {
    element: 'select',
    command: 'fontSize',
    options: [
      { value: '', text: 'Font size' },
      { value: 1, text: 1 },
      { value: 2, text: 2 },
      { value: 3, text: 3 },
      { value: 4, text: 4 },
      { value: 5, text: 5 },
      { value: 6, text: 6 },
      { value: 7, text: 7 }
    ]
  },

  fontName: {
    element: 'select',
    command: 'fontName',
    options: [
      { value: 'Times', text: 'Font name' },
      { value: 'Raleway', text: 'Raleway' },
      { value: 'Roboto', text: 'Roboto' },
      { value: 'Poppins', text: 'Poppins' },
      { value: 'Cairo', text: 'Cairo' }
    ]
  },

  separator: {
    element: 'styling',
    class: 'styler-separator'
  },

  color: {
    element: 'input',
    type: 'text',
    command: 'foreColor',
    init: colorpicker,
    initConfig: {
      defaultColor: '#000000',
      mode: 'hex',
      events: {
        beforeSubmit: function beforeSubmit() {
          if (!SELECTION) { return; }
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(SELECTION);
        },
        afterOpen: function afterOpen() {
          if (!window.getSelection().rangeCount) { return; }
          SELECTION = window.getSelection().getRangeAt(0);
        }
      }
    }
  }
};

var icons = {
  blockquote: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',
  bold: 'M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z',
  fontSize: 'M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z',
  h1: 'M20.1,4.3c-2.2,0.2-2.4,0.3-2.4,2.5v10.4c0,2.2,0.2,2.4,2.4,2.5v0.8h-7.4v-0.8c2.3-0.2,2.5-0.3,2.5-2.5v-5.1H6v5.1 c0,2.2,0.2,2.4,2.4,2.5v0.8H1.2v-0.8c2.1-0.2,2.3-0.3,2.3-2.5V6.8c0-2.2-0.2-2.3-2.4-2.5V3.5h7.2v0.8C6.2,4.5,6,4.6,6,6.8v4.1 h9.2V6.8c0-2.2-0.2-2.3-2.3-2.5V3.5h7.2V4.3z',
  h2: 'M20.1,4.3c-2.2,0.2-2.4,0.3-2.4,2.5v10.4c0,2.2,0.2,2.4,2.4,2.5v0.8h-7.4v-0.8c2.3-0.2,2.5-0.3,2.5-2.5v-5.1H6v5.1 c0,2.2,0.2,2.4,2.4,2.5v0.8H1.2v-0.8c2.1-0.2,2.3-0.3,2.3-2.5V6.8c0-2.2-0.2-2.3-2.4-2.5V3.5h7.2v0.8C6.2,4.5,6,4.6,6,6.8v4.1 h9.2V6.8c0-2.2-0.2-2.3-2.3-2.5V3.5h7.2V4.3z',
  html: 'M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z',
  image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  indent: 'M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z',
  italic: 'M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z',
  justifyCenter: 'M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z',
  justifyFull: 'M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z',
  justifyLeft: 'M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z',
  justifyRight: 'M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z',
  p: 'M12.4,2.5c2.1,0,3.9,0.3,5.1,1.2c1.2,0.9,2,2.2,2,4.2c0,3.8-2.9,5.7-5.8,6c-0.5,0.1-1.1,0.1-1.4,0L10,13.3v4.5 c0,2.5,0.3,2.7,3,2.9v0.8H4.6v-0.8c2.4-0.2,2.6-0.4,2.6-2.9V6.3c0-2.6-0.3-2.7-2.5-2.9V2.5H12.4z M10,12.3c0.4,0.1,1.2,0.4,2.1,0.4 c1.9,0,4.2-1,4.2-4.7c0-3.2-2-4.5-4.4-4.5c-0.8,0-1.4,0.2-1.6,0.4C10.1,4,10,4.4,10,5.2V12.3z',
  pre: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  removeFormat: 'M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z',
  strikeThrough: 'M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z',
  text: 'M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z',
  underline: 'M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z'
};

var Styler = function Styler(align, ref) {
  if ( ref === void 0 ) ref = {};
  var mode = ref.mode; if ( mode === void 0 ) mode = 'default';
  var commands = ref.commands; if ( commands === void 0 ) commands = ['bold', 'italic', 'underline'];

  this.align = align;
  this.settings = {
    mode: mode,
    commands: commands,
  };
  this.init();
};

Styler.extend = function extend (name, extention) {
  formats[name] = extention;
};

/**
 * Create button HTML element
 * @param {String} name 
 */
Styler.button = function button (name) {
  var button = document.createElement('button');
  button.classList.add('styler-button');
  button.id = name;
  button.insertAdjacentHTML('afterbegin', ("\n      <svg class=\"icon\" viewBox=\"0 0 24 24\">\n        <path d=\"" + (icons[name]) + "\"/>\n      </svg>\n    "));
  return button;
};

/**
 * Create select options HTML element
 * @param {String} name 
 * @param {Object} options 
 */
Styler.select = function select (name, options) {
  var select = document.createElement('select');
  select.classList.add('styler-select');
  select.id = name;
  options.forEach(function (option) {
    var optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.innerText = option.text;
    select.appendChild(optionElement);
  });
  return select;
};

/**
 * Create input HTML element
 * @param {String} name 
 * @param {String} type 
 */
Styler.input = function input (name, type) {
  var input = document.createElement('input');
  input.classList.add(("styler-" + name));
  input.id = name;
  input.type = type;
  return input;
};

/**
 * Create the styler toolbar
 */
Styler.prototype.init = function init () {
    var this$1 = this;

  this.styler = document.createElement('ul');
  this.styler.classList.add('styler', ("is-" + (this.settings.mode)));
  this.style = {};
  this.inits = {};
  this.align.el.appendChild(this.styler);

  this.settings.commands.forEach(function (el) {
    var li = document.createElement('li');
    var current = formats[el];
    if (!current) {
      console.warn(el + ' is not found');
      return;
    }

    switch (current.element) {
      case 'button':
        this$1.style[el] = Styler.button(el);
        // some buttons don't have commands
        // instead it use functions form align class
        // here we detect which callback should be use
        var callBack =
          current.command ?
          this$1.execute.bind(this$1) :
          this$1.align[current.func].bind(this$1.align);
          
        this$1.style[el].addEventListener('click', function () {
          callBack(current.command, current.value);
        });
        li.appendChild(this$1.style[el]);
        break;

      case 'select':
        this$1.style[el] = Styler.select(el, current.options);
        this$1.style[el].addEventListener('change', function () {
          var selection = this$1.style[el];
          this$1.execute(current.command, selection[selection.selectedIndex].value);
        });
        li.appendChild(this$1.style[el]);
        break;
        
      case 'input': 
        this$1.style[el] = Styler.input(el, current.type);
        this$1.style[el].addEventListener('change', function () {
          this$1.align.el.focus();
          this$1.execute(current.command, this$1.style[el].value);
        });
        li.appendChild(this$1.style[el]);
        break;
          
      case 'styling': 
        li.classList.add(current.class);
        break;

      case 'custom':
        var markup = current.create();
        li.appendChild(markup);
        break;

      default:
        console.warn(el + ' is not found');
        return; 
    }

    if (current.init) {
      this$1.inits[el] = new current.init(this$1.style[el], current.initConfig);
    }

    this$1.styler.appendChild(li);
  });

  if (this.settings.mode === 'bubble') { this.initBubble(); }
};

Styler.prototype.initBubble = function initBubble () {
  this.styler.classList.add('is-hidden');
  this.reference = document.createElement('sapn');
};
/**
 * Execute command for the selected button
 * @param {String} cmd 
 * @param {String|Number} value 
 */
Styler.prototype.execute = function execute (cmd, value) {
  if (this.align.HTML) { return; }
  document.execCommand(cmd, false, value);
  this.align.el.focus();
  this.updateStylerStates();
};

Styler.prototype.updateBubblePosition = function updateBubblePosition () {
  var position = this.selection.getBoundingClientRect();
  var deltaY = position.y - 70;
  var deltaX = position.x + (position.width / 2) - (this.styler.offsetWidth / 2);
  this.styler.style.top = (deltaY > 0 ? deltaY : 0) + "px";
  this.styler.style.left = (deltaX > 50 ? deltaX : 50) + "px";
    
};
Styler.prototype.showStyler = function showStyler () {
  this.styler.classList.add('is-visible');
  this.styler.classList.remove('is-hidden');
  this.updateBubblePosition();
};

Styler.prototype.hideStyler = function hideStyler () {
  this.styler.classList.remove('is-visible');
  this.styler.classList.add('is-hidden');
};

Styler.prototype.updateStylerStates = function updateStylerStates () {
  this.updateStylerCommands();
  if (this.settings.mode !== 'bubble') { return; }

  this.selection = window.getSelection().getRangeAt(0);
  if (this.selection.collapsed) {
    this.hideStyler();
    return;
  }
  this.showStyler();
};

/**
 * Update the state of the active style
 */
Styler.prototype.updateStylerCommands = function updateStylerCommands () {
    var this$1 = this;

  Object.keys(this.style).forEach(function (styl) {
    if (document.queryCommandState(styl)) {
      this$1.style[styl].classList.add('is-active');
      return;
    }
    if (document.queryCommandValue('formatBlock') === styl) {
      this$1.style[styl].classList.add('is-active');
      return;
    }
    if (document.queryCommandValue(styl) && document.queryCommandValue(styl) !== 'false') {
      this$1.style[styl].value = document.queryCommandValue(styl);
      return;
    }
    if (this$1.inits[styl]) {
      // if (this.inits[styl].isMenuActive) return;
      this$1.inits[styl].selectColor(document.queryCommandValue('foreColor'), true);
      return;
    }
    this$1.style[styl].classList.remove('is-active');
  });
};

highlight.registerLanguage('javascript', javascript);

var Align = function Align(selector, ref) {
  if ( ref === void 0 ) ref = {};
  var defaultText = ref.defaultText; if ( defaultText === void 0 ) defaultText = 'Type here';
  var styler = ref.styler; if ( styler === void 0 ) styler = null;

  this.el = select(selector);
  this.options = {
    defaultText: defaultText,
    styler: styler
  };
  this.init();
};

var prototypeAccessors = { content: { configurable: true } };

/**
 * Get editor's content
 */
prototypeAccessors.content.get = function () {
  return document.createTextNode(this.text.innerHTML);
};

Align.extend = function extend (name, extension) {
  Styler.extend(name, extension);
};

/**
 * Create all editor elements
 */
Align.prototype.init = function init () {
  this.HTML = false;
  this.styler = new Styler(this, this.options.styler);
  this.initEditor();
  this.initEvents();
};

/**
 * Create the editor
 */
Align.prototype.initEditor = function initEditor () {
  this.text = document.createElement('div');
  this.paragraph = document.createElement('p');

  this.text.contentEditable = 'true';
  this.text.classList.add('align-text');
  this.paragraph.innerText = this.options.defaultText + '\n';

  this.el.appendChild(this.text);
  this.text.appendChild(this.paragraph);
};

/**
 * Add all events listeners
 */
Align.prototype.initEvents = function initEvents () {
    var this$1 = this;

  this.text.addEventListener('focus', function () {
    this$1.highlight();
  });

  this.text.addEventListener('mouseup', function (event) {
    this$1.styler.updateStylerStates();
  });

  window.addEventListener("keyup", function (event) {
    // Do nothing if the event was already processed
    if (event.defaultPrevented) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        // Do something for "down arrow" key press.
        break;
      case "ArrowUp":
        // Do something for "up arrow" key press.
        break;
      case "ArrowLeft":
        this$1.styler.updateStylerStates();
        break;
      case "ArrowRight":
        this$1.styler.updateStylerStates();
        break;
      case 'Tab':
        this$1.execute('indent');
        break;

      default:
        return;
    }

    // Cancel the default action to avoid it being handled twice
    // event.preventDefault();
  }, true);
};

/**
 * Hightlight code text
 */
Align.prototype.highlight = function highlight$$1 () {
  var code = Array.from(this.text.querySelectorAll('pre'));

  code.forEach(function (block) {
    highlight.highlightBlock(block);
  });
};

/**
 * Toggle on/off HTML represntation
 */
Align.prototype.toggleHTML = function toggleHTML () {
  this.HTML = !this.HTML;
  if (this.HTML) {
    var content = document.createTextNode(this.text.innerHTML);
    var pre = document.createElement("pre");

    this.text.innerHTML = "";
    this.text.contentEditable = false;
    pre.id = "content";
    pre.contentEditable = false;
    pre.appendChild(content);
    this.text.appendChild(pre);
    return;
  }
  this.text.innerHTML = this.text.innerText;
  this.text.contentEditable = true;
  this.text.focus();
};

Object.defineProperties( Align.prototype, prototypeAccessors );

return Align;

})));
