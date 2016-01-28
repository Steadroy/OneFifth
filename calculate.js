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

			// Check for overlap
			if ((box_b.x < (box_a.x + box_a.width)) && (box_b.y < (box_a.y + box_a.height))) {
				console.log('overlap');
				console.log(box_a, box_b);

				var d_width = box_a.x + box_a.width - box_b.x;
				var d_height = box_a.y + box_a.height - box_b.y;

				if (box_b.x + d_width > box_b.x + box_b.width) {
					d_width = box_b.width;
				}

				if (box_b.y + d_height > box_b.y + box_b.height) {
					d_height = box_b.height;
				}

				sum -= d_width*d_height;
			}
		}
	}

	return (sum/total)*100;
}