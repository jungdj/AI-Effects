import numpy as np
import cv2
from scipy.interpolate import interp1d

def to_fxfy(txy_list, **kwargs):
    """ Transforms a list [ (ti, (xi,yi)) ] into 2 functions (fx,fy)
        where fx : t -> x(t)  and  fy : t -> y(t).
        If the time t is out of the bounds of the tracking time interval
        fx and fy return the position of the object at the start or at
        the end of the tracking time interval.
        Keywords can be passed to decide the kind of interpolation,
        see the doc of ``scipy.interpolate.interp1d``."""                                                                        
        
    tt, pointsXXYY = zip(*txy_list.items())
    
    xx, yy = zip(*pointsXXYY)
    xx1, xx2 = zip(*xx)
    yy1, yy2 = zip(*yy)
    
    interp_x1 = interp1d(tt, xx1, **kwargs)
    interp_y1 = interp1d(tt, yy1, **kwargs)
    fx1 = lambda t: xx1[0] if (t <= tt[0]) else ( xx1[-1] if t >= tt[-1]
                                          else ( interp_x1(t) ) )
    fy1 = lambda t: yy1[0] if (t <= tt[0]) else ( yy1[-1] if t >= tt[-1]
                                          else ( interp_y1(t) ) )
    
    interp_x2 = interp1d(tt, xx2, **kwargs)
    interp_y2 = interp1d(tt, yy2, **kwargs)
    fx2 = lambda t: xx2[0] if (t <= tt[0]) else ( xx2[-1] if t >= tt[-1]
                                          else ( interp_x2(t) ) )
    fy2 = lambda t: yy2[0] if (t <= tt[0]) else ( yy2[-1] if t >= tt[-1]
                                          else ( interp_y2(t) ) )
                                          
    return fx1,fy1,fx2,fy2
    
def blurFaces(clip, net, confidence_threshold):
    #if r_blur is None: r_blur = 2*r_zone/3
    
    def fl(gf,t):
        
        im = gf(t)
        im_copy = im.copy()
        h,w,d = im.shape
        
        blob = cv2.dnn.blobFromImage(cv2.resize(im, (300, 300), interpolation = cv2.INTER_AREA), 1.0,
            (300, 300), (104.0, 177.0, 123.0))
     
    	# pass the blob through the network and obtain the detections and
    	# predictions
        net.setInput(blob)
        detections = net.forward()
    	
        # loop over the detections
        for i in range(0, detections.shape[2]):
            # extract the confidence (i.e., probability) associated with the
            # prediction
            confidence = detections[0, 0, i, 2]
        
            # filter out weak detections by ensuring the `confidence` is
            # greater than the minimum confidence
            if confidence < confidence_threshold:
                continue
        
            # compute the (x, y)-coordinates of the bounding box for the
            # object
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
        
            # draw the bounding box of the face along with the associated
            # probability
            text = "{:.2f}%".format(confidence * 100)
            # y = startY - 10 if startY - 10 > 10 else startY + 10
            # cv2.rectangle(im, (startX, startY), (endX, endY), (0, 0, 255), 2)
            # cv2.putText(im, text, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
            
            orig = im[startY:endY, startX:endX]
            blurred = cv2.GaussianBlur(orig,(35, 35), 30)
            im_copy[startY:endY, startX:endX] = blurred


        #region_size = y2-y1,x2-x1
        #print region_size
        
        #mask = np.zeros(region_size).astype('uint8')
        #region_size = np.array(region_size)
        #r_blur = 2*region_size/3
        #r_blur = tuple(r_blur)
        #region_size = tuple(region_size)
        
        #cv2.circle(img, center, radius, color[, thickness[, lineType[, shift]]]) 
        #cv2.rectangle(img, pt1, pt2, color[, thickness[, lineType[, shift]]]) 
        
        #cv2.circle(mask, (region_size[0]/2,region_size[1]/2), region_size[0]/2, 255, -1, lineType=cv2.CV_AA)
        #cv2.rectangle(mask, (x1,y1), (x2,y2), 255, -1, lineType=cv2.CV_AA)
                               
        #mask = np.dstack(3*[(1.0/255)*mask])
        
       # orig = im[y1:y2, x1:x2]
        #blurred = cv2.blur(orig,(region_size[0]/2, region_size[0]/2))
        #im[y1:y2, x1:x2] = mask*blurred + (1-mask)*orig
        
        return im_copy
    
    return clip.fl(fl)