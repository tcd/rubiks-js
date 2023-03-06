/* eslint-disable quotes */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-this-alias */

import { THREE } from "./lib/THREE"

const ERNO = {};

(function() {
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined }
        let evt = document.createEvent("CustomEvent")
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        return evt
    }
    CustomEvent.prototype = window.Event.prototype
    window.CustomEvent = CustomEvent
})()

/**
 * @author [sole](http://soledadpenades.com)
 * @author [mrdoob](http://mrdoob.com)
 * @author [Robert Eisele](http://www.xarg.org)
 * @author [Philippe](http://philippe.elsass.me)
 * @author [Robert Penner](http://www.robertpenner.com/easing_terms_of_use.html)
 * @author [Paul Lewis](http://www.aerotwist.com/)
 * @author lechecacharro
 * @author [Josh Faul](http://jocafa.com/)
 * @author [egraether](http://egraether.com/)
 * @author [endel](http://endel.me)
 * @author [Ben Delarre](http://delarre.net)
 */
TWEEN.Tween = function(object) {
    let _object = object
    let _valuesStart = {}
    let _valuesEnd = {}
    let _valuesStartRepeat = {}
    let _duration = 1000
    let _repeat = 0
    let _yoyo = false
    let _isPlaying = false
    let _reversed = false
    let _delayTime = 0
    let _startTime = null
    let _easingFunction = TWEEN.Easing.Linear.None
    let _interpolationFunction = TWEEN.Interpolation.Linear
    let _chainedTweens = []
    let _onStartCallback = null
    let _onStartCallbackFired = false
    let _onUpdateCallback = null
    let _onCompleteCallback = null
    // Set all starting values present on the target object
    for (let field in object) {
        _valuesStart[field] = parseFloat(object[field], 10)
    }
    this.to = function(properties, duration) {
        if (duration !== undefined) {
            _duration = duration
        }
        _valuesEnd = properties
        return this
    }
    this.start = function(time) {
        TWEEN.add(this)
        _isPlaying = true
        _onStartCallbackFired = false
        _startTime = time !== undefined ? time : (typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now())
        _startTime += _delayTime
        for (let property in _valuesEnd) {
            // check if an Array was provided as property value
            if (_valuesEnd[property] instanceof Array) {
                if (_valuesEnd[property].length === 0) {
                    continue
                }
                // create a local copy of the Array with the start value at the front
                _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property])
            }
            _valuesStart[property] = _object[property]
            if ((_valuesStart[property] instanceof Array) === false) {
                _valuesStart[property] *= 1.0 // Ensures we're using numbers, not strings
            }
            _valuesStartRepeat[property] = _valuesStart[property] || 0
        }
        return this
    }
    this.stop = function() {
        if (!_isPlaying) {
            return this
        }
        TWEEN.remove(this)
        _isPlaying = false
        this.stopChainedTweens()
        return this
    }
    this.stopChainedTweens = function() {
        for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
            _chainedTweens[i].stop()
        }
    }
    this.delay = function(amount) {
        _delayTime = amount
        return this
    }
    this.repeat = function(times) {
        _repeat = times
        return this
    }
    this.yoyo = function(yoyo) {
        _yoyo = yoyo
        return this
    }
    this.easing = function(easing) {
        _easingFunction = easing
        return this
    }
    this.interpolation = function(interpolation) {
        _interpolationFunction = interpolation
        return this
    }
    this.chain = function() {
        _chainedTweens = arguments
        return this
    }
    this.onStart = function(callback) {
        _onStartCallback = callback
        return this
    }
    this.onUpdate = function(callback) {
        _onUpdateCallback = callback
        return this
    }
    this.onComplete = function(callback) {
        _onCompleteCallback = callback
        return this
    }
    this.update = function(time) {
        let property
        if (time < _startTime) {
            return true
        }
        if (_onStartCallbackFired === false) {
            if (_onStartCallback !== null) {
                _onStartCallback.call(_object)
            }
            _onStartCallbackFired = true
        }
        let elapsed = (time - _startTime) / _duration
        elapsed = elapsed > 1 ? 1 : elapsed
        let value = _easingFunction(elapsed)
        for (property in _valuesEnd) {
            let start = _valuesStart[property] || 0
            let end = _valuesEnd[property]
            if (end instanceof Array) {
                _object[property] = _interpolationFunction(end, value)
            } else {
                // Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof (end) === "string") {
                    end = start + parseFloat(end, 10)
                }
                // protect against non numeric properties.
                if (typeof (end) === "number") {
                    _object[property] = start + (end - start) * value
                }
            }
        }
        if (_onUpdateCallback !== null) {
            _onUpdateCallback.call(_object, value)
        }
        if (elapsed == 1) {
            if (_repeat > 0) {
                if (isFinite(_repeat)) {
                    _repeat--
                }
                // reassign starting values, restart by making startTime = now
                for (property in _valuesStartRepeat) {
                    if (typeof (_valuesEnd[property]) === "string") {
                        _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10)
                    }
                    if (_yoyo) {
                        let tmp = _valuesStartRepeat[property]
                        _valuesStartRepeat[property] = _valuesEnd[property]
                        _valuesEnd[property] = tmp
                        _reversed = !_reversed
                    }
                    _valuesStart[property] = _valuesStartRepeat[property]
                }
                _startTime = time + _delayTime
                return true
            } else {
                if (_onCompleteCallback !== null) {
                    _onCompleteCallback.call(_object)
                }
                for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                    _chainedTweens[i].start(time)
                }
                return false
            }
        }
        return true
    }
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
//
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
// using 'self' instead of 'window' for compatibility with both NodeJS and IE10.
(function() {
    let lastTime = 0
    let vendors = ["ms", "moz", "webkit", "o"]
    for (let x = 0; x < vendors.length && !self.requestAnimationFrame; ++x) {
        self.requestAnimationFrame = self[vendors[x] + "RequestAnimationFrame"]
        self.cancelAnimationFrame = self[vendors[x] + "CancelAnimationFrame"] || self[vendors[x] + "CancelRequestAnimationFrame"]
    }
    if (self.requestAnimationFrame === undefined && self["setTimeout"] !== undefined) {
        self.requestAnimationFrame = function(callback) {
            let currTime = Date.now(), timeToCall = Math.max(0, 16 - (currTime - lastTime))
            let id = self.setTimeout(function() { callback(currTime + timeToCall) }, timeToCall)
            lastTime = currTime + timeToCall
            return id
        }
    }
    if (self.cancelAnimationFrame === undefined && self["clearTimeout"] !== undefined) {
        self.cancelAnimationFrame = function(id) { self.clearTimeout(id) }
    }
}())

THREE.CSS3DRenderer = function() {
    // console.log( 'THREE.CSS3DRenderer', THREE.REVISION );
    let _width, _height
    let _widthHalf, _heightHalf
    let matrix = new THREE.Matrix4()
    let domElement = document.createElement("div")
    domElement.style.overflow = "hidden"
    domElement.style.WebkitTransformStyle = "preserve-3d"
    domElement.style.MozTransformStyle = "preserve-3d"
    domElement.style.oTransformStyle = "preserve-3d"
    domElement.style.transformStyle = "preserve-3d"
    this.domElement = domElement
    let cameraElement = document.createElement("div")
    cameraElement.style.WebkitTransformStyle = "preserve-3d"
    cameraElement.style.MozTransformStyle = "preserve-3d"
    cameraElement.style.oTransformStyle = "preserve-3d"
    cameraElement.style.transformStyle = "preserve-3d"
    domElement.appendChild(cameraElement)
    this.setClearColor = function() {
    }
    this.setSize = function(width, height) {
        _width = width
        _height = height
        _widthHalf = _width / 2
        _heightHalf = _height / 2
        domElement.style.width = width + "px"
        domElement.style.height = height + "px"
        cameraElement.style.width = width + "px"
        cameraElement.style.height = height + "px"
    }
    let epsilon = function(value) {
        return Math.abs(value) < 0.000001 ? 0 : value
    }
    let getCameraCSSMatrix = function(matrix) {
        let elements = matrix.elements
        return 'matrix3d(' +
            epsilon(elements[0]) + ',' +
            epsilon(- elements[1]) + ',' +
            epsilon(elements[2]) + ',' +
            epsilon(elements[3]) + ',' +
            epsilon(elements[4]) + ',' +
            epsilon(- elements[5]) + ',' +
            epsilon(elements[6]) + ',' +
            epsilon(elements[7]) + ',' +
            epsilon(elements[8]) + ',' +
            epsilon(- elements[9]) + ',' +
            epsilon(elements[10]) + ',' +
            epsilon(elements[11]) + ',' +
            epsilon(elements[12]) + ',' +
            epsilon(- elements[13]) + ',' +
            epsilon(elements[14]) + ',' +
            epsilon(elements[15]) +
            ')'
    }
    let getObjectCSSMatrix = function(matrix) {
        let elements = matrix.elements
        return 'translate3d(-50%,-50%,0) matrix3d(' +
            epsilon(elements[0]) + ',' +
            epsilon(elements[1]) + ',' +
            epsilon(elements[2]) + ',' +
            epsilon(elements[3]) + ',' +
            epsilon(- elements[4]) + ',' +
            epsilon(- elements[5]) + ',' +
            epsilon(- elements[6]) + ',' +
            epsilon(- elements[7]) + ',' +
            epsilon(elements[8]) + ',' +
            epsilon(elements[9]) + ',' +
            epsilon(elements[10]) + ',' +
            epsilon(elements[11]) + ',' +
            epsilon(elements[12]) + ',' +
            epsilon(elements[13]) + ',' +
            epsilon(elements[14]) + ',' +
            epsilon(elements[15]) +
            ')'
    }
    let getObjectCSSTransform = function() {
        let position = new THREE.Vector3(),
            scale = new THREE.Vector3(),
            euler = new THREE.Euler(),
            quaternion = new THREE.Quaternion(),
            style
        euler._quaternion = quaternion
        quaternion._euler = euler
        return function(matrix) {
            // position.copy( object.position )
            // euler.copy( object.rotation )
            matrix.decompose(position, quaternion, scale)
            // euler.copy( object.rotation )
            return 'translate3d(-50%,-50%,0) translate3d(' + epsilon(position.x) + 'px, ' + epsilon(position.y) + 'px, ' + epsilon(position.z) + 'px) '
                + 'rotateX(' + epsilon(euler.x) + 'rad) rotateY(' + epsilon(euler.y) + 'rad) rotateZ(' + epsilon(euler.z) + 'rad) '
                + 'scale3d(' + epsilon(scale.x) + ', ' + epsilon(-scale.y) + ', ' + epsilon(scale.z) + ')'
        }
    }()
    let renderObject = function(object, camera) {
        if (object instanceof THREE.CSS3DObject) {
            let style
            if (object instanceof THREE.CSS3DSprite) {
                // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/
                matrix.copy(camera.matrixWorldInverse)
                matrix.transpose()
                matrix.copyPosition(object.matrixWorld)
                matrix.scale(object.scale)
                matrix.elements[3] = 0
                matrix.elements[7] = 0
                matrix.elements[11] = 0
                matrix.elements[15] = 1
                style = getObjectCSSTransform(matrix)
            } else {
                style = getObjectCSSTransform(object.matrixWorld)
            }
            let element = object.element
            element.style.WebkitTransformStyle = 'preserve-3d'
            element.style.MozTransformStyle = 'preserve-3d'
            element.style.oTransformStyle = 'preserve-3d2'
            element.style.transformStyle = 'preserve-3d'
            element.style.WebkitTransform = style
            element.style.MozTransform = style
            element.style.oTransform = style
            element.style.transform = style
            if (element.parentNode !== cameraElement) {
                cameraElement.appendChild(element)
            }
        }
        for (let i = 0, l = object.children.length; i < l; i++) {
            renderObject(object.children[i], camera)
        }
    }
    this.render = function(scene, camera) {
        // if( !this.done ){
        //  this.done = true;
        let fov = 0.5 / Math.tan(THREE.Math.degToRad(camera.fov * 0.5)) * _height
        domElement.style.WebkitPerspective = fov + "px"
        domElement.style.MozPerspective = fov + "px"
        domElement.style.oPerspective = fov + "px"
        domElement.style.perspective = fov + "px"
        scene.updateMatrixWorld()
        if (camera.parent === undefined) camera.updateMatrixWorld()
        camera.matrixWorldInverse.getInverse(camera.matrixWorld)
        let style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix(camera.matrixWorldInverse) +
            " translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)"
        cameraElement.style.WebkitTransform = style
        cameraElement.style.MozTransform = style
        cameraElement.style.oTransform = style
        cameraElement.style.transform = style
        renderObject(scene, camera)
        // }
    }
}

// Let's add some functionality to Cubelet's prototype
// By adding to Cubelet's prototype and not the Cubelet constructor
// we're keeping instances of Cubelet super clean and light.


// This is a basic css renderer that uses a modified version of the three.js CSS3DRenderer.
// Having the renderer is a seperate file allows us to abstract all the visual components
// of the cube in a simple, straightforward way.
// THREE.JS HACK
// You can actually use a THREE.Object3D as a Scene like object
// and render it with the THREE.CSS3DRenderer. For projects with filesize restrictions,
// this is useful as it allows you to exclude the THREE.Scene and all it's dependancies entirely.
// The only caveat is that we need to temporarily define/re-define a dummy Scene object
let SceneType = THREE.Scene
THREE.Scene = SceneType || function() { }
ERNO.renderers = ERNO.renderers || {}
ERNO.renderers.CSS3D = function(cubelets, cube) {
    // SCENE + RENDERER
    let renderer = new THREE.CSS3DRenderer(),
        scene = new THREE.Object3D()
    renderer.scene = scene
    // Add the cube 3D object to the scene
    scene.add(cube.autoRotateObj3D)
    scene.add(cube.camera)
    // FACE LABELS
    let faceLabel, axis = new THREE.Vector3()
    cube.faces.forEach(function(face, i) {
        faceLabel = cube[face.face].label = new THREE.CSS3DObject(document.createElement('div'))
        faceLabel.element.classList.add('faceLabel')
        faceLabel.position.copy(face.axis).multiplyScalar(cube.size)
        faceLabel.position.negate()
        faceLabel.element.innerHTML = face.face.toUpperCase()
        cube.object3D.add(faceLabel)
    })
    cube.right.label.rotation.y = Math.PI * 0.5
    cube.left.label.rotation.y = Math.PI * -0.5
    cube.back.label.rotation.y = Math.PI
    cube.up.label.rotation.x = Math.PI * -0.5
    cube.down.label.rotation.x = Math.PI * 0.5
    function showItem(item) {
        item.style.display = 'block'
    }
    function hideItem(item) {
        item.style.display = 'none'
    }
    function getFaceLabelElements() {
        return Array.prototype.slice.call(renderer.domElement.querySelectorAll('.faceLabel'))
    }
    cube.showFaceLabels = function() {
        getFaceLabelElements().forEach(showItem)
        this.showingFaceLabels = true
        return this
    }
    cube.hideFaceLabels = function() {
        getFaceLabelElements().forEach(hideItem)
        this.showingFaceLabels = false
        return this
    }
    // CSS CUBELETS
    // Each ERNO.Cubelet is an abstract representation of a cubelet,
    // it has some useful information like a list of faces, but it doesn't have any visual component.
    //  Here we take the abstract cubelet and create something you can see.
    // First we add some functionality to the ERNO.Cubelet specific to css,
    // things like setOpacity, and showStickers directly affects css styles.
    ERNO.extend(ERNO.Cubelet.prototype, ERNO.renderers.CSS3DCubelet.methods)
    //  Then we use the CSS3DCubelet function to create all the dom elements.
    cubelets.forEach(ERNO.renderers.CSS3DCubelet)
    // RENDER LOOP
    function render() {
        if (cube.domElement.parentNode) {
            let parentWidth = cube.domElement.parentNode.clientWidth,
                parentHeight = cube.domElement.parentNode.clientHeight
            if (cube.domElement.parentNode &&
                (cube.domElement.clientWidth !== parentWidth ||
                    cube.domElement.clientHeight !== parentHeight)) {
                cube.setSize(parentWidth, parentHeight)
            }
            renderer.render(scene, cube.camera)
        }
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
    // We'll need to set the scene object back to it's original type
    if (SceneType) THREE.Scene = SceneType
    // All renderers must return an object containing a domElement and an setSize method,
    // in most instances this is the renderer object itself.
    return renderer
}
ERNO.renderers.CSS3DCubelet = (function() {
    return function(cubelet) {
        let domElement = document.createElement('div')
        domElement.classList.add('cubelet')
        domElement.classList.add('cubeletId-' + cubelet.id)
        cubelet.css3DObject = new THREE.CSS3DObject(domElement)
        cubelet.css3DObject.name = 'css3DObject-' + cubelet.id
        cubelet.add(cubelet.css3DObject)
        let faceSpacing = (cubelet.size / 2)
        let transformMap = [
            "rotateX(   0deg ) translateZ( " + faceSpacing + "px ) rotateZ(   0deg )",
            "rotateX(  90deg ) translateZ( " + faceSpacing + "px ) rotateZ(   0deg )",
            "rotateY(  90deg ) translateZ( " + faceSpacing + "px ) rotateZ(   0deg )",
            "rotateX( -90deg ) translateZ( " + faceSpacing + "px ) rotateZ(  90deg )",
            "rotateY( -90deg ) translateZ( " + faceSpacing + "px ) rotateZ( -90deg )",
            "rotateY( 180deg ) translateZ( " + faceSpacing + "px ) rotateZ( -90deg )",
        ]
        let axisMap = [
            'axisZ',
            'axisY',
            'axisX',
            'axisY',
            'axisX',
            'axisZ',
        ]
        // CUBELET FACES
        // We're about to loop through our 6 faces
        // and create visual dom elements for each
        // Here's our overhead for that:
        cubelet.faces.forEach(function(face) {
            // FACE CONTAINER.
            // This face of our Cubelet needs a DOM element for all the
            // related DOM elements to be attached to.
            face.element = document.createElement('div')
            face.element.classList.add('face')
            face.element.classList.add(axisMap[face.id])
            face.element.classList.add('face' + ERNO.Direction.getNameById(face.id).capitalize())
            cubelet.css3DObject.element.appendChild(face.element)
            // WIREFRAME.
            let wireframeElement = document.createElement('div')
            wireframeElement.classList.add('wireframe')
            face.element.appendChild(wireframeElement)
            // CUBELET ID.
            // For debugging we want the ability to display this Cubelet's ID number
            // with an underline (to make numbers like 6 and 9 legible upside-down).
            let idElement = document.createElement('div')
            idElement.classList.add('id')
            face.element.appendChild(idElement)
            let underlineElement = document.createElement('span')
            underlineElement.classList.add('underline')
            underlineElement.innerText = cubelet.id
            idElement.appendChild(underlineElement)
            // Each face has a different orientation represented by a CSS 3D transform.
            // Here we select and apply the correct one.
            let cssTransform = transformMap[face.id],
                style = face.element.style
            style.OTransform = style.MozTransform = style.WebkitTransform = style.transform = cssTransform
            // INTROVERTED FACES.
            // If this face has no color sticker then it must be interior to the Cube.
            // That means in a normal state (no twisting happening) it is entirely hidden.
            if (face.isIntrovert) {
                face.element.classList.add('faceIntroverted')
                face.element.appendChild(document.createElement('div'))
            }
            // EXTROVERTED FACES.
            // But if this face does have a color then we need to
            // create a sticker with that color
            // and also allow text to be placed on it.
            else {
                face.element.classList.add('faceExtroverted')
                // STICKER.
                // You know, the color part that makes the Cube
                // the most frustrating toy ever.
                let stickerElement = document.createElement('div')
                stickerElement.classList.add('sticker')
                stickerElement.classList.add(face.color.name)
                face.element.appendChild(stickerElement)
                // If this happens to be our logo-bearing Cubelet
                // we had better attach the logo to it!
                if (cubelet.isStickerCubelet) {
                    stickerElement.classList.add('stickerLogo')
                }
                // TEXT.
                // One character per face, mostly for our branding.
                let textElement = document.createElement('div')
                textElement.classList.add('text')
                textElement.innerText = face.id
                face.text = textElement
                face.element.appendChild(textElement)
            }
        })
        // These will perform their actions, of course,
        // but also setup their own boolean toggles.
        cubelet.show()
        cubelet.showIntroverts()
        cubelet.showPlastics()
        cubelet.showStickers()
        cubelet.hideIds()
        cubelet.hideTexts()
        cubelet.hideWireframes()
    }
}())
//  The method object contains functionality specific to the CSS3D renderer that we add
// to the ERNO.Cubelet prototype
ERNO.renderers.CSS3DCubelet.methods = (function() {
    function showItem(item) {
        item.style.display = 'block'
    }
    function hideItem(item) {
        item.style.display = 'none'
    }
    return {
        // Visual switches.
        getFaceElements: function(selector) {
            let selectorString = selector || ''
            return Array.prototype.slice.call(this.css3DObject.element.querySelectorAll('.face' + selectorString))
        },
        show: function() {
            showItem(this.css3DObject.element)
            this.showing = true
        },
        hide: function() {
            hideItem(this.css3DObject.element)
            this.showing = false
        },
        showExtroverts: function() {
            this.getFaceElements('.faceExtroverted').forEach(showItem)
            this.showingExtroverts = true
        },
        hideExtroverts: function() {
            this.getFaceElements('.faceExtroverted').forEach(hideItem)
            this.showingExtroverts = false
        },
        showIntroverts: function() {
            let axis = new THREE.Vector3(),
                inv = new THREE.Matrix4(),
                only
            return function(onlyAxis, soft) {
                only = ''
                if (onlyAxis) {
                    inv.getInverse(this.matrix)
                    axis.copy(onlyAxis).transformDirection(inv)
                    only = (Math.abs(Math.round(axis.x)) === 1) ? '.axisX' : (Math.round(Math.abs(axis.y)) === 1) ? '.axisY' : '.axisZ'
                }
                this.getFaceElements('.faceIntroverted' + (onlyAxis !== undefined ? only : "")).forEach(showItem)
                if (!soft) this.showingIntroverts = true
            }
        }(),
        hideIntroverts: function() {
            let axis = new THREE.Vector3(),
                inv = new THREE.Matrix4(),
                only
            return function(onlyAxis, soft) {
                only = ''
                if (onlyAxis) {
                    inv.getInverse(this.matrix)
                    axis.copy(onlyAxis).transformDirection(inv)
                    only = (Math.abs(Math.round(axis.x)) === 1) ? '.axisX' : (Math.round(Math.abs(axis.y)) === 1) ? '.axisY' : '.axisZ'
                }
                this.getFaceElements('.faceIntroverted' + (onlyAxis !== undefined ? only : "")).forEach(hideItem)
                if (!soft) this.showingIntroverts = false
            }
        }(),
        showPlastics: function() {
            this.getFaceElements().forEach(function(item) {
                item.classList.remove('faceTransparent')
            })
            this.showingPlastics = true
        },
        hidePlastics: function() {
            this.getFaceElements().forEach(function(item) {
                item.classList.add('faceTransparent')
            })
            this.showingPlastics = false
        },
        hideStickers: function() {
            this.getFaceElements(' .sticker').forEach(hideItem)
            this.showingStickers = false
        },
        showStickers: function() {
            this.getFaceElements(' .sticker').forEach(showItem)
            this.showingStickers = true
        },
        showWireframes: function() {
            this.getFaceElements(' .wireframe').forEach(showItem)
            this.showingWireframes = true
        },
        hideWireframes: function() {
            this.getFaceElements(' .wireframe').forEach(hideItem)
            this.showingWireframes = false
        },
        showIds: function() {
            this.getFaceElements(' .id').forEach(showItem)
            this.showingIds = true
        },
        hideIds: function() {
            this.getFaceElements(' .id').forEach(hideItem)
            this.showingIds = false
        },
        showTexts: function() {
            this.getFaceElements(' .text').forEach(showItem)
            this.showingTexts = true
        },
        hideTexts: function() {
            this.getFaceElements(' .text').forEach(hideItem)
            this.showingTexts = false
        },
        getOpacity: function() {
            return this.opacity
        },
        setOpacity: function(opacityTarget, onComplete) {
            if (this.opacityTween) this.opacityTween.stop()
            if (opacityTarget === undefined) opacityTarget = 1
            if (opacityTarget !== this.opacity) {
                let
                    that = this,
                    tweenDuration = (opacityTarget - this.opacity).absolute().scale(0, 1, 0, 1000 * 0.2)
                this.opacityTween = new TWEEN.Tween({ opacity: this.opacity })
                    .to({
                        opacity: opacityTarget
                    }, tweenDuration)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate(function() {
                        that.css3DObject.element.style.opacity = this.opacity
                        that.opacity = this.opacity//opacityTarget
                    })
                    .onComplete(function() {
                        if (onComplete instanceof Function) onComplete()
                    })
                    .start()
            }
        },
        getStickersOpacity: function(value) {
            return parseFloat(this.getFaceElements(' .sticker')[0].style.opacity)
        },
        setStickersOpacity: function(value) {
            if (value === undefined) value = 0.2
            let valueStr = value
            this.getFaceElements(' .sticker').forEach(function(sticker) {
                sticker.style.opacity = valueStr.toString()
            })
        }
    }
}())

ERNO.Cube = function(parameters) {

    // Good to let each Cubelet know where it exists
    this.cubelets.forEach(function(cubelet, i) {
        cubelet.setAddress(i)
    })
    //  RENDERER
    // Create a renderer object from the renderer factory.
    //  The renderFactory is a function that creates a renderer object
    this.renderer = renderFactory(this.cubelets, this)
    this.domElement = this.renderer.domElement
    this.domElement.classList.add('cube')
    this.domElement.style.fontSize = this.cubeletSize + 'px'
    this.autoRotateObj3D.add(this.object3D)
    if (this.hideInvisibleFaces) this.hideIntroverts(null, true)
    // The Interaction class provides all the nifty mouse picking stuff.
    // It's responsible for figuring out what cube slice is supposed to rotate
    // and in what direction.
    this.mouseInteraction = new ERNO.Interaction(this, this.camera, this.domElement)
    this.mouseInteraction.addEventListener('click', function(evt) {
        this.dispatchEvent(new CustomEvent("click", { detail: evt.detail }))
    }.bind(this))
    // set up interactive controls
    // The Controls class rotates the entire cube around using an arcball implementation.
    // You could override this with a different style of control
    this.controls = new (parameters.controls || ERNO.Controls)(this, this.camera, this.domElement)
    // We need to map our folds separately from Cube.map()
    // because we only want folds mapped at creation time.
    // Remapping folds with each Cube.twist() would get weird...
    this.folds = [
        new ERNO.Fold(this.front, this.right),
        new ERNO.Fold(this.left, this.up),
        new ERNO.Fold(this.down, this.back)
    ]
    // Enable some "Hero" text for this Cube.
    // this.setText( 'BEYONDRUBIKs  CUBE', 0 );
    // this.setText( 'BEYONDRUBIKs  CUBE', 1 );
    // this.setText( 'BEYONDRUBIKs  CUBE', 2 );
    //  Define a default size for our cube, this will be resized to 100%
    // of it's containing dom element during the render.
    this.setSize(400, 200)
    // Get ready for major loop-age.
    // Our Cube checks these booleans at 60fps.
    this.loop = this.loop.bind(this)
    requestAnimationFrame(this.loop)
    // The cube needs to respond to user interaction and react accordingly.
    // We'll set up a few event below to listen for specific commands,
    // Enable key commands for our Cube.
    document.addEventListener('keypress', function(event) {
        if (event.target.tagName.toLowerCase() !== 'input' &&
            event.target.tagName.toLowerCase() !== 'textarea' &&
            !this.mouseInteraction.active &&
            this.keyboardControlsEnabled) {
            let key = String.fromCharCode(event.which)
            if ('XxRrMmLlYyUuEeDdZzFfSsBb'.indexOf(key) >= 0) this.twist(key)
        }
    }.bind(this))
}
ERNO.Cube.prototype = Object.create(ERNO.Group.prototype)
ERNO.extend(ERNO.Cube.prototype, {
    shuffle: function(amount, sequence) {
        // How many times should we shuffle?
        amount = amount || 30
        // Optional sequence of moves to execute instead of picking
        // random moves from this.shuffleMethod.
        sequence = sequence || ''
        let moves = this.shuffleMethod.slice(),
            move, inverseOfLastMove = new ERNO.Twist(), allowedMoves,
            sequenceLength = sequence.length, sequenceIndex = 0
        // We're shuffling the cube so we should clear any history
        this.twistQueue.empty(true)
        this.historyQueue.empty(true)
        // Create some random rotations based on our shuffle method
        while (amount-- > 0) {
            if (sequence) {
                move.set(sequence[sequenceIndex])
                sequenceIndex = (sequenceIndex + 1) % sequenceLength
            } else {
                // Create a copy of all possible moves
                allowedMoves = moves.split('')
                move = new ERNO.Twist().copy(inverseOfLastMove)
                // We don't want to chose a move that reverses the last shuffle, it just looks odd,
                // so we should only select a move if it's a new one.
                while (move.equals(inverseOfLastMove)) {
                    move.set(allowedMoves.splice(Math.floor(Math.random() * allowedMoves.length), 1)[0])
                }
            }
            // If we flag this move as a shuffle, then we can remove it from the history
            // once we've executed it.
            move.isShuffle = true
            // execute the shuffle
            this.twist(move)
            // Store a reference to the reverse of the move ( a twist that undoes the shuffle )
            inverseOfLastMove = move.getInverse()
        }
        // By stashing the last move in our shuffle sequence, we can
        //  later check if the shuffling is complete
        this.finalShuffle = move
    },
    solve: function() {
        this.isSolving = true
    },
    isSolved: function() {
        return (
            this.front.isSolved(ERNO.Direction.FRONT) &&
            this.up.isSolved(ERNO.Direction.UP) &&
            this.right.isSolved(ERNO.Direction.RIGHT) &&
            this.down.isSolved(ERNO.Direction.DOWN) &&
            this.left.isSolved(ERNO.Direction.LEFT) &&
            this.back.isSolved(ERNO.Direction.BACK)
        )
    },
    undo: function() {
        if (this.twistQueue.history.length > 0) {
            this.historyQueue.add(this.twistQueue.undo().getInverse())
            this.undoing = true
        }
    },
    redo: function() {
        if (this.twistQueue.future.length > 0) {
            this.undoing = true
            this.historyQueue.empty()
            this.historyQueue.add(this.twistQueue.redo())
        }
    },
    twist: function(command) {
        if (this.undoing) this.twistQueue.empty()
        this.historyQueue.empty()
        this.undoing = false
        this.twistQueue.add(command)
    },
    immediateTwist: function(twist) {
        if (this.verbosity >= 0.8) {
            console.log(
                'Executing a twist command to rotate the ' +
                twist.group + ' ' + twist.wise + ' by',
                twist.degrees, 'degrees.'
            )
        }
        //  We now need to find the slice to rotate and figure out how much we need to rotate it by.
        let slice = this.slicesDictionary[twist.command.toLowerCase()],
            rotation = (twist.degrees === undefined ? 90 : twist.degrees) * twist.vector,
            radians = rotation.degreesToRadians(),
            duration = Math.abs(radians - slice.rotation) / (Math.PI * 0.5) * this.twistDuration
        let l = slice.indices.length,
            cubelet
        while (l-- > 0) {
            slice.getCubelet(l).isTweening = true
        }
        // Boom! Rotate a slice
        new TWEEN.Tween(slice)
            .to({
                rotation: radians
            }, duration)
            .easing(TWEEN.Easing.Quartic.Out)
            .onComplete(function() {
                slice.rotation = radians
                slice.axis.rotation = 0
                // Invalidate our cubelet tweens
                l = slice.indices.length
                while (l-- > 0) {
                    cubelet = slice.getCubelet(l)
                    cubelet.isTweening = false
                    cubelet.updateMatrix()
                    cubelet.matrixSlice.copy(cubelet.matrix)
                }
                // If the rotation changes the cube then we should update the cubelet mapping
                if (rotation !== 0) {
                    slice.rotateGroupMappingOnAxis(radians)
                    // Also, since everythings changed, we might aswell tell everyone
                    this.dispatchEvent(new CustomEvent('onTwistComplete', {
                        detail: {
                            slice: slice,
                            twist: twist
                        }
                    }))
                }
                // If we're on the final twist of a shuffle
                if (twist === this.finalShuffle) {
                    this.finalShuffle = null
                    this.dispatchEvent(new CustomEvent('onShuffleComplete', {
                        detail: {
                            slice: slice,
                            twist: twist
                        }
                    }))
                }
            }.bind(this))
            .start(this.time)
    },
    // We can read and write text to the Cube.
    // This is handled by Folds which are composed of two Faces.
    getText: function(fold) {
        if (fold === undefined) {
            return [
                this.folds[0].getText(),
                this.folds[1].getText(),
                this.folds[2].getText()
            ]
        }
        else if (_.isNumeric(fold) && fold >= 0 && fold <= 2) {
            return this.folds[fold].getText()
        }
    },
    setText: function(text, fold) {
        if (fold === undefined) {
            this.folds[0].setText(text)
            this.folds[1].setText(text)
            this.folds[2].setText(text)
        }
        else if (_.isNumeric(fold) && fold >= 0 && fold <= 2) {
            this.folds[fold].setText(text)
        }
    },
    setSize: function(width, height) {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    },
    // Shuffle methods.
    PRESERVE_LOGO: 'RrLlUuDdSsBb',             // Preserve the logo position and rotation.
    ALL_SLICES: 'RrMmLlUuEeDdFfSsBb',       // Allow all slices to rotate.
    EVERYTHING: 'XxRrMmLlYyUuEeDdZzFfSsBb', // Allow all slices, and also full cube X, Y, and Z rotations.
    // The cube does its own loopage.
    // It attempts to execute twists in the twistQueue
    // and then tasks in the taskQueue.
    // This is how shuffling and solving are handled.
    loop: (function() {
        let time = 0
        return function() {
            requestAnimationFrame(this.loop)
            // Kick off the next animation frame
            let localTime = (typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now())
            let frameDelta = localTime - (time || localTime)
            time = localTime
            if (!this.paused) {
                // Update the internal animation frame
                this.time += frameDelta
                TWEEN.update(this.time)
                if (this.autoRotate) {
                    this.rotation.x += this.rotationDelta.x
                    this.rotation.y += this.rotationDelta.y
                    this.rotation.z += this.rotationDelta.z
                }
                // If the Cube is "ready"
                // and not a single cubelet is currently tweening
                // regardless of it's resting state (engagement;
                // meaning it could in theory not be tweening but
                // has come to rest at where rotation % 90 !== 0.
                if (this.isReady && this.isTweening() === 0) {
                    // if( this.twistQueue.isReady ){
                    let queue = this.undoing ? this.historyQueue : this.twistQueue
                    // We have zero twists in the queue
                    // so perhaps we'd like to add some?
                    if (queue.future.length === 0) {
                        // If the cube ought to be solving and a solver exists
                        // and we're not shuffling, tweening, etc.
                        if (this.isSolving && window.solver) {
                            this.isSolving = window.solver.consider(this)
                        }
                        // If we are doing absolutely nothing else
                        // then we can can try executing a task.
                        else if (this.taskQueue.isReady === true) {
                            let task = this.taskQueue.do()
                            if (task instanceof Function) task()
                        }
                    }
                    // Otherwise, we have some twists in the queue
                    // and we should put everything else aside and tend to those.
                    else {
                        let twist = queue.do()
                        if (twist.command.toLowerCase() !== 'x' &&
                            twist.command.toLowerCase() !== 'y' &&
                            twist.command.toLowerCase() !== 'z' &&
                            twist.degrees !== 0) this.moveCounter += this.undoing ? -1 : 1
                        // If the twist we're about to execute does not actually
                        // change any slices, ie, we're rotating back to 0,
                        // then we don't need to remember it.
                        if (twist.degrees === 0 || twist.isShuffle) queue.purge(twist)
                        this.immediateTwist(twist)
                    }
                    // }
                }
                // Our mouse controls should only be active if we are not rotating
                this.mouseInteraction.enabled = this.mouseControlsEnabled && !this.finalShuffle
                this.mouseInteraction.update()
                this.controls.enabled = this.mouseControlsEnabled && !this.mouseInteraction.active
                this.controls.update()
            }
        }
    }())
})
