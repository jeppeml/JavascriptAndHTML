
self.addEventListener('message', function(e) {
  var data = e.data;
  var imgDataResult = getFractalImageData(data.WorkerId, data.ImageData, data.FractalType, data.Zoom, data.ImageData.width, data.ImageData.width);
  self.postMessage(imgDataResult);
  //self.close(); // Terminates the worker.
}, false);


function setPixel(imageData, x, y, r, g, b, a) 
{
	var index = (x + y * imageData.width) * 4;
	imageData.data[index+0] = r;
	imageData.data[index+1] = g;
	imageData.data[index+2] = b;
	imageData.data[index+3] = a;
}
	
function getFractalImageData(workerId, imageData, FractalType, Zoom, width, height) 
{
	var pixelCount = 0;
	var xFractMax = 2.5/Zoom;
	var xFractMin = (-2.5)/Zoom;
	var yFractMax = 2.5/Zoom;
	var yFractMin = (-1.5)/Zoom;
	var xStepFract = (xFractMax-xFractMin)/width;
	var yStepFract = (yFractMax-yFractMin)/height;
	var y=0;
	//return " pixelCount:" + pixelCount +" Zoom:" + Zoom +" xFractMin:" + xFractMin +" width:" + width +" height:" + height;
	//var imageData = ImageData;

	for (yFract = yFractMin; yFract < yFractMax; yFract+=yStepFract) 
	{
		for (xFract = xFractMin; xFract < xFractMax; xFract+=xStepFract) 
		{
			var count = 1;
			pixelCount++;
			var a = xFract;
			var b = yFract;
			
			while ((a*a+b*b<4) && count<30)
			{
				switch (FractalType)
				{
					case "Mandelbrot":
						var c = a*a-b*b+xFract;
						b=2*a*b+yFract;
						a=c;
					break;
					case "Julia":
						var c = a*a-b*b-1;
						b=2*a*b;
						a=c;
					break;
					default: // Defaults to Mandelbrot
						var c = a*a-b*b+xFract;
						b=2*a*b+yFract;
						a=c;
					break;
				}					
				count++;
			}
			if (count==30)
			{
				setPixel(imageData, (((xFract-xFractMin)/xStepFract)),(((yFract-yFractMin)/yStepFract)),255|0,255|0,255|0,255);
			}
			else if (count>0)
			{
				var calcColor=(count*64 % 255)|0;
				setPixel(imageData, (((xFract-xFractMin)/xStepFract)|0),(((yFract-yFractMin)/yStepFract)|0),calcColor,calcColor,calcColor,255);
			}
		}
	}
	//return pixelCount;
	return {'WorkerId': workerId, 'ImageData': imageData};
}

