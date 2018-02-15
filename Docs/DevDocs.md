# Developer Documentation

## Directives

### **o2rInteractiveFigure**

__Path__: `client/app/o2rInteractiveFigure`

__Description:__ Creates a single interactive figure within an erc. It handles opencpu requests and listens to parameter changes. Also handles different comparison types for maps as well as timeseries. Enables downloading the computed figures as well as their corresponding parameters.

__Inputs:__
  - __o2r-figure__: metadata of a single figure, i.e. `metadata.o2r.interaction[n]` 
  - __ercid__: id of an erc

__Example:__
```html 
<o2r-interactive-figure o2r-figure="figure" ercid="{{ercId}}"></o2r-interactive-figure>
```

### **largeInteractiveView**

__Path__: `client/app/largeInteractiveView`

__Description:__ Creates a fullscreen dialog that contains a single interactive figure  

__Inputs:__ 
  - __o2r-figure__: metadata of a single figure, i.e. `metadata.o2r.interaction[n]` 
  - __ercid__: id of an erc

__Example:__
```html 
<large-interactive-view o2r-figure="figure" ercid="{{ercId}}"></large-interactive-view>
```

### **o2rSideBySide**

__Path__: `client/app/o2rSideBySide`

__Description:__ Displays two figures side by side, regardless if the content is a time series or a raster map. Uses `img`-tag for raster data and calls `o2rTimeseries`-directive for handling time series.

__Inputs:__ 
  - __o2r-original-figure__: metadata for a single figure containing the original data (img path or time series json), i.e. `metadata.o2r.interaction[n]`  
  - __o2r-modified-figure__:  data retrieved from the openCPU request (img path or time series json).
  - __plotly-Layout__: Styling object for __plotly.js__. Amongst others, contains title of a figure 

__Example:__
```html 
<o2r-side-by-side o2r-original-figure="figure" o2r-modified-figure="modifiedFigure" plotly-Layout="layout"></o2r-side-by-side>
```
### **o2rTimeseries**

__Path__: `client/app/o2rTimeseries`

__Description:__ o2r-wrapper for __plotly.js__. Creates an interactive time series. Expects a json conformant with the __plotly.js__ specification. Can handle one or multiple time series in a single plot.

__Inputs:__ 
  - __o2r-data__: time series json, conformant with __plotly.js__ specification
  - __o2r-layout__:  layout object. See __plotly.js__ specification for more details

__Example:__
```javascript
    var data = [{
        x: [2000,2001,2002,2003,2004,.....,2010],
        y: [4,1,5,17,...,3]
    }];
    // where x are the x-axis value and the y are the values for the y-axis. 
    // For multiple lines in the plot just insert multiple objects into the array.
    var layout = {title: 'Title of the plot'};
```
```html 
<o2r-timeseries o2r-data="data" o2r-layout="layout" </o2r-timeseries>
```
    

### **sliderImageDirective**

__Path__: `client/app/sliderImageDirective`

__Description:__ Creates swipe interaction for maps. Places one map above the other. Using a slider a user can regulate the visibility of the upper map.

__Inputs:__ 
  - __o2r-original-figure__: path to original image file 
  - __o2r-modified-figure__: path the modified image file, i.e. path from openCPU response

__Example:__ 
```html 
<slide-image-comparison o2r-original-figure="figure.original.image" o2r-modified-figure="figure.modifiedFigure"></slide-image-comparison>
```

### **raster-sweep**
__Github Repo:__ https://github.com/Interactive2017/rasterSweep  

__Description:__ Peephole highlighting difference between two images. Interaction via moving a sliding windows over two images. Displays content of one image within sliding window; the other image outside of the sliding window. Bordercolor of window highlights the amount of different pixels between the two images for the area within the sliding window. Sliding window is resizable.

__Inputs:__ 
  - __rs-base__: path to base image
  - __rs-overlay__: path to overlay image

__Example:__  
```html 
<raster-sweep rs-base="/foo/bar/base.img" rs-overlay="/foo/bar/overlay.img"></raster-sweep>
```

__Installation:__ `bower install raster-sweep --save`
