window._iconfont_svg_string_5061369 = '<svg><symbol id="icon-shuju" viewBox="0 0 1024 1024"><path d="M600.405333 388.394667l-7.082666-202.453334a342.058667 342.058667 0 0 1 253.696 236.544l-202.496 7.082667a42.666667 42.666667 0 0 1-44.117334-41.173333z m334.208 31.573333a427.178667 427.178667 0 0 0-344.917333-321.578667c-46.506667-7.68-83.669333 32.682667-82.048 79.786667l7.466667 213.205333a128 128 0 0 0 132.394666 123.477334l213.205334-7.466667c47.104-1.621333 84.821333-41.557333 73.898666-87.424zM401.066667 234.666667l-0.042667-0.085334a42.666667 42.666667 0 1 0-35.2-77.738666A384.128 384.128 0 0 0 512 896a384.128 384.128 0 0 0 355.2-237.824 42.666667 42.666667 0 0 0-76.074667-38.613333l-0.341333-0.170667A298.794667 298.794667 0 0 1 213.333333 512a298.752 298.752 0 0 1 187.733334-277.376z" fill="#14101C" ></path></symbol></svg>',
(n => {
    var t = (e = (e = document.getElementsByTagName("script"))[e.length - 1]).getAttribute("data-injectcss")
      , e = e.getAttribute("data-disable-injectsvg");
    if (!e) {
        var o, i, a, c, d, s = function(t, e) {
            e.parentNode.insertBefore(t, e)
        };
        if (t && !n.__iconfont__svg__cssinject__) {
            n.__iconfont__svg__cssinject__ = !0;
            try {
                document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")
            } catch (t) {
                console && console.log(t)
            }
        }
        o = function() {
            var t, e = document.createElement("div");
            e.innerHTML = n._iconfont_svg_string_5061369,
            (e = e.getElementsByTagName("svg")[0]) && (e.setAttribute("aria-hidden", "true"),
            e.style.position = "absolute",
            e.style.width = 0,
            e.style.height = 0,
            e.style.overflow = "hidden",
            e = e,
            (t = document.body).firstChild ? s(e, t.firstChild) : t.appendChild(e))
        }
        ,
        document.addEventListener ? ~["complete", "loaded", "interactive"].indexOf(document.readyState) ? setTimeout(o, 0) : (i = function() {
            document.removeEventListener("DOMContentLoaded", i, !1),
            o()
        }
        ,
        document.addEventListener("DOMContentLoaded", i, !1)) : document.attachEvent && (a = o,
        c = n.document,
        d = !1,
        r(),
        c.onreadystatechange = function() {
            "complete" == c.readyState && (c.onreadystatechange = null,
            l())
        }
        )
    }
    function l() {
        d || (d = !0,
        a())
    }
    function r() {
        try {
            c.documentElement.doScroll("left")
        } catch (t) {
            return void setTimeout(r, 50)
        }
        l()
    }
}
)(window);
