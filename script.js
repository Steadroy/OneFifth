$(function(){
	var reader = new FileReader();

	var img = new Image();
	var img_data = null;
	var img_size = {
		height: 0,
		width: 0
	};

	var display = $('.display').first();
	var display_offset = display.offset();

	display.append(img);
	$(img).addClass('displayer');

	var data = [
		{
			value: 0,
			color: '#FF6F21'
		},
		{
			value: 100,
			color: '#333333'
		}
	];

	var chart = new Chart($('#chart')[0].getContext('2d')).Doughnut(data, {
		segmentShowStroke: false,
		segmentStrokeWidth : 0,
	});

	reader.addEventListener("load", function () {
		img.src = reader.result;

		img_size.width = img.width;
		img_size.height = img.height;
	}, false);

	$('#selection').change(function (e) {
		$('.box').remove();
		reader.readAsDataURL($(this)[0].files[0]);
	});

	var ghost = $('.ghost').first();

	var box = null;
	var box_offset = {
		top: 0,
		left: 0
	};

	ghost.mousedown(function (e) {
		if (selected) {
			$('.box').removeClass('selected');
			selected = null;
		}

		if (!evented) {
			box = $('<div class="box"></div>');
			display.append(box);

			box_offset = {
				top: e.pageY,
				left: e.pageX
			};

			box.css({
				top: (box_offset.top - display_offset.top) + 'px',
				left: (box_offset.left - display_offset.left) + 'px'
			});
		}
	});

	ghost.mousemove(function (e) {
		if (box !== null) {
			if (e.pageY < box_offset.top) {
				box.css('top', (e.pageY - display_offset.top) + 'px');
			}

			if (e.pageX < box_offset.left) {
				box.css('left', (e.pageX - display_offset.left) + 'px');
			}

			box.css({
				height: Math.abs(e.pageY - box_offset.top) + 'px',
				width: Math.abs(e.pageX - box_offset.left) + 'px'
			});
		}
	});

	ghost.mouseup(function (e) {
		if (box && (box.height() < 3 || box.width() < 3)) {
			box.remove();
		}

		box = null;
	});

	var evented = false;
	var selected = null;
	var clicked = false;

	var evented_action = function (e) {
		if (!evented) {
			evented = true;
			$('.box').addClass('evented');
			clicked = false;
		}
	};

	var unevented_action = function (e) {
		if (evented) {
			evented = false;
			$('.box').removeClass('evented');
			clicked = false;
		}
	};

	Mousetrap.bind(['ctrl', 'command'], evented_action, 'keydown');
	Mousetrap.bind(['ctrl', 'command'], unevented_action, 'keyup');

	$('a.select').click(function (e) {
		evented_action(e);
		clicked = true;
	});

	$('a.draw').click(unevented_action);

	var del_action = function (e) {
		if (selected) {
			selected.remove();
			selected = null;
		}
	};

	Mousetrap.bind('del', del_action);

	display.on('click', '.box', function (e) {

		if (clicked) {
			unevented_action(e);
		}

		$('.box').removeClass('selected');
		selected = $(this);
		selected.addClass('selected');
	});


	var clear_action = function () {
		$('.box').remove();
	};

	$('a.clear').click(clear_action);

	Mousetrap.bind('c', clear_action);

	$('a.delete').click(del_action);


	var calc_action = function () {
		console.log('calculating');

		var image = $(img);
		var image_offset = image.offset();
		var image_dimensions = {
			height: image.height(),
			width: image.width()
		};

		var boxes = [];

		$('.box').each(function () {
			var offset = $(this).offset();
			var dimensions = {
				width: $(this).width(),
				height: $(this).height()
			};

			var x = offset.left - image_offset.left;
			var y = offset.top - image_offset.top;
			var height = dimensions.height;
			var width = dimensions.width;

			if (offset.left + dimensions.width < image_offset.left) {
				return;
			} else if (offset.left > image_offset.left + image_dimensions.width) {
				return;
			}

			if (offset.left < image_offset.left) {
				x = 0;
			}

			if (offset.top < image_offset.top) {
				y = 0;
			}

			if (offset.left + dimensions.width > image_offset.left + image_dimensions.width) {
				width = (image_offset.left + image_dimensions.width) - offset.left;
			}

			if (offset.top + dimensions.height > image_offset.top + image_dimensions.height) {
				height = (image_offset.top + image_dimensions.height) - offset.top;
			}

			boxes.push({
				x: x,
				y: y,
				width: width,
				height: height
			});
		});

		console.log(boxes);

		var percentage = Math.round(calculate(image_dimensions, boxes));
		chart.segments[0].value = percentage;
		chart.segments[1].value = 100 - percentage;

		$('span.percentage').html(percentage + '%');

		chart.update();
	};

	$('a.calc').click(calc_action);
	Mousetrap.bind('x', calc_action);
});