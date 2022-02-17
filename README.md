# responsive-poster-react
一个在react框架下利用canvas生成海报的简单组件
A simple REACT component for generating posters 

![图 1](../images/85afb81be5c5f1f5760e206a04be03de05b01f57d278445ca794df7516d665ba.png)  

## feature
- Take advantage of the simple json-like object to easily use
- With a given area as frame, the image (for example, the NFT image) in it will be automatically positioned and resized to the most suitable place for displaying .
- 通过传入简单的类json数据来轻松使用
- 通过先给定的数据设置相框区域，传入相框内的图片会自动定位并调整大小到最适宜展示的程度

# install, import & use

```shell
npm i responsive-poster-react
```

```js
import Poster from 'responsive-poster-react';
```

```js
<Poster posterData={posterData} />
```


**tips: the 'responsiveImage' item must be set after the 'rect' item to activate the automation**
**提示：数组中的responsiveImage对象必须被放置在rect对象之后来启用自动定位和调整大小**

<details>
<summary>demo数据例子（点击展开）</summary><br>

```js
import bg from './assets/poster_zh.png'
import error from './assets/error.png'
import test from './assets/test.jpg'

const posterData = {
	error: error,
	exportHeight: 740, // true height of the exported image
	cw: 4689, //canvas width
	ch: 7364, //canvas height
	bgColor: '#808080', //background color
	drawData: [
		{
			type: 'staticImage', //background image
			url: bg,
			left: 0,
			top: 0,
			width: 4689,
			height: 7363,
			
		}, //
		{
			type: 'text', //
			content: '1024',
			width: 800,
			top: 6050,
			left: 450,
			fontSize: 260,
			fontWeight: 'bold',
			color: '#0043a5',
		}, //
		{
			type: 'text',
			content: 'Shinomiya',
			top: 4550,
			left: 2344.5,
			fontSize: 200,
			textAlign: 'center',
			fontWeight: 'bold',
			color: '#000'
		},
		{
			type: 'rect',
			left: 200,
			top: 1200,
			width: 4289,
			height: 2930,
			borderRadius: 200,
			borderColor: '#ff0000',
			opacity: 1,

		},
		{
			type: 'responsiveImage',
			url: test
		},
		{
			type: 'qrcode',
			url: 'http://localhost:3001/',
			left: 3590,
			top: 6350,
			width: 710,
			height: 710
		}
	]
}


const App = () => <Poster
				posterData={posterData}
				/>
render(<App />, document.getElementById('root'))
```

</details>


# params
### posterData

key | notes |  type | default value | required
---|---|---|---|---
cw| the canvas width | Number|  |yes|
ch| the canvas height | Number|  |yes|
bgColor| the canvas background color | String | #ffffff | no|
error| the default image if the image load failed| url | | yes|
exportHeight| the exported image height, as the width will be auto | Number | |yes|
drawData| the main data as below | Array |   |yes|

### drawData
An array of objects and each item can be one of the following:


##### type: text
draw a line of text
key | notes |  type | default value | required
---|---|---|---|---
type| must be 'text' | String |  |yes|
top | the distance between the image top edge and the canvas top edge| Number| 0 |no|
left| the distance between the image left edge and the canvas left edge| Number| 0 |no|
fontSize| - |Number|16|no
color| - | String | '#000' |no 
baseLine | choose the base line among 'top', 'left', 'right', 'bottom'| String | 'bottom' | no
textAlign | 'left', 'right' or 'center' |String | 'center' | no
content | the text content to be displayed | String ||yes|
opacity |-| Number |1| no
fontWeight |-| String or Number |'normal'|no
fontStyle| 'normal', 'italic', 'small-caps' or 'normal' etc.|String |'normal'|no
fontFamily|-|String|'Microsoft YaHei'|no

##### type:line
draw a line
key | notes |  type | default value | required
---|---|---|---|---
type| must be 'line' | String |  |yes|
startX| the x value (same as 'left' above) of the start of the line| Number | |yes|
startY| the y value (same as 'top' above) of the start of the line| Number | |yes|
endX| the x value of the end of the line| Number | |yes|
endY| the y value of the end of the line| Number | |yes|
color|-|String|'#000'|no
width|line width|Number|1|no|
lineCap|same as the css property 'stroke-linecap'|String|'butt'|no

##### type: staticImage
draw a image
key | notes |  type | default value | required
---|---|---|---|---
type| must be 'staticImage' | String |  |yes|
url|the image URI| String||yes
top|same as above |Number|0|no
left|same as above |Number|0|no
width| set the width of the image|Number|0|no
height| set the height of the image|Number|0|no
borderRadius|same as the css property 'border-radius'|Number|0|no
borderWidth| same as the css property 'border-width'|Number|0|no
borderColor| same as the css property 'border-color'|String|'rgba(255,255,255,1)'|no

##### type: qrcode
draw a qrcode 
key | notes |  type | default value | required
---|---|---|---|---
type| must be 'staticImage' | String |  |yes|
url|the string to be transferred to qrcode|String||yes
top|same as above |Number|0|no
left|same as above |Number|0|no
width| set the width of the image|Number|0|no
height| set the height of the image|Number|0|no
borderRadius|same as the css property 'border-radius'|Number|0|no
borderWidth| same as the css property 'border-width'|Number|0|no
borderColor| same as the css property 'border-color'|String|'rgba(255,255,255,1)'|no



##### type: rect
draw a rectangle or a frame to display 
key | notes |  type | default value | required
---|---|---|---|---
type| must be 'rect' | String |  |yes|
width|-|Number|0|no
height|-|Number|0|yes
left|-|Number|0|yes
top|-|Number|0|yes
backgroundColor|-|String||no
borderWidth| same as the css property 'border-width'|Number|0|no
borderColor| same as the css property 'border-color'|String|'#000'|no
borderRadius|same as the css property 'border-radius'|Number|0|no
opacity|-|Number|1| no

**tips: the 'responsiveImage' item must be set after the 'rect' item to activate the automation**

##### type: responsiveImage
draw a responsive image that can be automatically positioned and resized
key | notes |  type | default value | required
---|---|---|---|---
type| must be 'responsiveImage' | String |  |yes|
url|the image uri|String|  |yes