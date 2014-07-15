(function($) {
	$.fn.circleProgressBar = function(options) {
     
		var defaults = {
			percent_display: "70%",
            percent_calculate: 0.70,
			theme: "Progress",
			color: "#009933",
			inner_radius: 95,
			outter_radius: 125,
			speed: 0.01,
            inner_circle_color: "#A0A0A0",
            outter_circle_color: "#D8D8D8",
            percent_display_style: {
                "font-size": "30px",
                "font-style": "normal",
                "font-weight": "bold",
                "color": "black",
                "top": "30%",
                "left": "43%"
            },
            theme_style: {
                "font-size": "30px",
                "font-style": "normal",
                "font-weight": "bold",
                "color": "black",
                "bottom": "35%",
                "left": "30%"
            }
		}

        var percent = this.data("percent");
        var theme = this.data("this");
        var color = this.data("color");
        var direction = this.data("direction");
        var inner_radius = this.data("inner-radius");
        var outter_radius = this.data("outter-radius")
        var speed = this.data("speed")
        var inner_circle_color = this.data("inner-circle-color");
        var outter_circle_color = this.data("outter-circle-color");
        var percent_display_style = this.data("percent-display-style");
        var theme_style = this.data("theme-style");

        function isEmpty(obj) {
            if (obj == null || obj == undefined) {
                return true 
            }else {
                return false;
            }
        }

        options = options == null ? {} : options;
        
        percent = isEmpty(options.percent) ? percent : options.percent;
        theme = isEmpty(options.theme) ? theme : options.theme;
        color = isEmpty(options.color) ? color : options.color;
        direction = isEmpty(options.direction) ? direction : options.direction; 
        inner_radius = isEmpty(options.inner_radius) ? inner_radius : options.inner_radius;
        outter_radius = isEmpty(options.outter_radius) ? outter_radius : options.outter_radius;
        speed = isEmpty(options.speed) ? speed : options.speed;
        inner_circle_color = isEmpty(options.inner_circle_color) ? inner_circle_color : options.inner_circle_color;
        outter_circle_color = isEmpty(options.outter_circle_color) ? outter_circle_color : options.outter_circle_color;
        percent_display_style = isEmpty(options.percent_display_style) ? percent_display_style : options.percent_display_style;
        theme_style = isEmpty(options.theme_style) ? theme_style : options.theme_style;


        var names = ["percent", "theme", "color", "direction", 
              "inner_radius", "outter_radius", "speed", "inner_circle_color", 
                    "outter_circle_color", "percent_display_style", "theme_style"];
        var values = [percent, theme, color, direction, inner_radius, 
              outter_radius, speed, inner_circle_color, outter_circle_color, percent_display_style, theme_style];

        (function(obj, names, values) {
            $.each(names, function(inx, name) {
                var value = values[inx];
                if (name == "percent") {
                    if (value != null && value != undefined) {
                        options["percent_display"] = value;
                        options["percent_calculate"] = new Number(value.substring(0, value.length - 1)) / 100;
                    }
                    if (options.hasOwnProperty(name)) {
                        delete options[name];
                    }
                }else if (name == "inner_radius" || name == "outter_radius") {
                    if (value != null && value != undefined) {
                        if (Object.prototype.toString.call(value) == "[object String]") {
                            if (value.substring(value.length - 2) == "px") {
                                options[name] = new Number(value.substring(0, value.length-2));
                            }else {
                                options[name] = new Number(value);
                            }
                        }else if(Object.prototype.toString.call(value) == "[object Number]") {
                            options[name] = value;
                        }else {
                            throw new Error("The type is wrong");
                        }
                    }else {
                        if (options.hasOwnProperty(name)) {
                            delete options[name];
                        }
                    }
                }else if(name == "percent_display_style" || name == "theme_style") {
                    if (value != null && value != undefined) {
                        options[name] = Object.prototype.toString.call(value) == "[object String]" ? value.parseJSON() : value;
                    }else {
                        if(options.hasOwnProperty(name)) {
                            delete options[name];
                        }
                    }
                }else {
                    if (value != null && value != undefined) {
                        options[name] = value;   
                    }else {
                        if (options.hasOwnProperty(name)) {
                            delete options[name];
                        }
                    }
                }
            })
        })(options, names, values);

        options = $.extend(defaults, options);

        //css
        var percent_display_style = {
            "position": "absolute",
            "text-align": "center",
            "display": "block",
        };

        percent_display_style = $.extend(options.percent_display_style, percent_display_style);

        var theme_style = {
            "position": "absolute",
            "text-align": "center",
            "display": "block",
        };

        theme_style = $.extend(options.theme_style, theme_style);

        this.empty();
        $percent = $("<label></label>").attr("id", "percent-display-area").appendTo(this);
        $theme = $("<label></label>").attr("id", "theme-display-area").appendTo(this);
        
        $percent.css(percent_display_style);
        $theme.css(theme_style);

        $percent.text("0%");
        $theme.text(options.theme);

        //css     
        var circle_progress_bar_container_position = {
        	"position": "relative"
        }

        this.css(circle_progress_bar_container_position);
        this.width(2 * options.outter_radius);
        
        $canvas = $("<canvas></canvas>").attr({
            "width": 2 * options.outter_radius,
            "height": 2 * options.outter_radius
        }).attr("id", "canvas-display-area").appendTo(this);
      
        var context = $canvas.get(0).getContext("2d");

        var x = $canvas.attr("width") / 2; 
        var y = $canvas.attr("height") / 2;
        var radius = $canvas.width() / 2.3;

        (function() {
            var args = arguments;
            context.clearRect(0, 0, $canvas.width(), $canvas.height());
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);

            context.fillStyle = options.inner_circle_color;
            context.fill();

            context.lineWidth = options.outter_radius - options.inner_radius;
            
            context.strokeStyle = options.outter_circle_color;
            context.stroke();

            var speed = options.speed * 2 * Math.PI;    
            var sum = options.percent_calculate / options.speed;
            var count = 1;
            var begin = 0.5 * Math.PI;
            var end = begin + speed;
            var step = options.speed * 100;
            var per_val = 0;
            (function(begin, end) {
              if (count <= sum) {
                var func = arguments.callee;
                context.beginPath();
                context.arc(x, y, radius, begin - (speed/10), end = (end > 2 * Math.PI) ? (end - 2 * Math.PI) : end, false);
                context.lineWith = options.outter_radius - options.inner_radius;
                context.strokeStyle = options.color;
                context.stroke();
                per_val = per_val + step;
                $percent.text(per_val + "%");

                begin = end;
                end = begin + speed;
                count ++;

                requestAnimationFrame(function() {
                    func.call(null, begin, end);
                })
              }
            })(begin, end);
        })();
	}

})(jQuery);