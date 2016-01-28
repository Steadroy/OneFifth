function calculate (image, boxes) {
	var total = image.width * image.height;
	var sum = 0;

	boxes.sort(function (a, b) {
		return a.x - b.x;
	});

	console.log(boxes);

	for (var i = 0; i < boxes.length; i++) {
		var box = boxes[i];
		sum += box.width * box.height;
	}

	console.log(sum/total);

	var stop_at = boxes.length - 1;

	for (i = 0; i < stop_at; i++) {
		var box_a = boxes[i];

		for (var j = i+1; j < boxes.length; j++) {
			var box_b = boxes[j];

			var ver_sort = [box_a, box_b];
			ver_sort.sort(function (a, b) {
				return a.y - b.y;
			});

			var ver_a = ver_sort[0];
			var ver_b = ver_sort[1];

			// Check for overlap
			if ((box_b.x < (box_a.x + box_a.width)) && (ver_b.y < (ver_a.y + ver_a.height))) {
				console.log('overlap');
				console.log(box_a, box_b);

				var d_width = box_a.x + box_a.width - box_b.x;
				var d_height = ver_a.y + ver_a.height - ver_b.y;

				if (box_b.x + d_width > box_b.x + box_b.width) {
					d_width = box_b.width;
				}

				if (ver_b.y + d_height > ver_b.y + ver_b.height) {
					d_height = box_b.height;
				}

				sum -= d_width*d_height;
			}
		}
	}

	return (sum/total)*100;
}