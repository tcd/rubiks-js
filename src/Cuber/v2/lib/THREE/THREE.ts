export class _Three {
    // =========================================================================
    // GL STATE CONSTANTS
    // =========================================================================

    public static CullFaceNone = 0
    public static CullFaceBack = 1
    public static CullFaceFront = 2
    public static CullFaceFrontBack = 3
    public static FrontFaceDirectionCW = 0
    public static FrontFaceDirectionCCW = 1

    // =========================================================================
    // SHADOWING TYPES
    // =========================================================================

    public static BasicShadowMap = 0
    public static PCFShadowMap = 1
    public static PCFSoftShadowMap = 2

    // =========================================================================
    // MATERIAL CONSTANTS
    // =========================================================================

    // side
    public static FrontSide = 0
    public static BackSide = 1
    public static DoubleSide = 2

    // shading
    public static NoShading = 0
    public static FlatShading = 1
    public static SmoothShading = 2

    // colors
    public static NoColors = 0
    public static FaceColors = 1
    public static VertexColors = 2

    // blending modes
    public static NoBlending = 0
    public static NormalBlending = 1
    public static AdditiveBlending = 2
    public static SubtractiveBlending = 3
    public static MultiplyBlending = 4
    public static CustomBlending = 5

    // custom blending equations
    // (numbers start from 100 not to clash with other mappings to OpenGL constants defined in Texture.js)
    public static AddEquation = 100
    public static SubtractEquation = 101
    public static ReverseSubtractEquation = 102

    // custom blending destination factors
    public static ZeroFactor = 200
    public static OneFactor = 201
    public static SrcColorFactor = 202
    public static OneMinusSrcColorFactor = 203
    public static SrcAlphaFactor = 204
    public static OneMinusSrcAlphaFactor = 205
    public static DstAlphaFactor = 206
    public static OneMinusDstAlphaFactor = 207

    // // custom blending source factors
    // public static ZeroFactor = 200
    // public static OneFactor = 201
    // public static SrcAlphaFactor = 204
    // public static OneMinusSrcAlphaFactor = 205
    // public static DstAlphaFactor = 206
    // public static OneMinusDstAlphaFactor = 207
    public static DstColorFactor = 208
    public static OneMinusDstColorFactor = 209
    public static SrcAlphaSaturateFactor = 210

    // =========================================================================
    // TEXTURE CONSTANTS
    // =========================================================================
    public static MultiplyOperation = 0
    public static MixOperation = 1
    public static AddOperation = 2

    // Mapping modes
    public static UVMapping = function() { }
    public static CubeReflectionMapping = function() { }
    public static CubeRefractionMapping = function() { }
    public static SphericalReflectionMapping = function() { }
    public static SphericalRefractionMapping = function() { }

    // Wrapping modes
    public static RepeatWrapping = 1000
    public static ClampToEdgeWrapping = 1001
    public static MirroredRepeatWrapping = 1002

    // Filters
    public static NearestFilter = 1003
    public static NearestMipMapNearestFilter = 1004
    public static NearestMipMapLinearFilter = 1005
    public static LinearFilter = 1006
    public static LinearMipMapNearestFilter = 1007
    public static LinearMipMapLinearFilter = 1008

    // Data types
    public static UnsignedByteType = 1009
    public static ByteType = 1010
    public static ShortType = 1011
    public static UnsignedShortType = 1012
    public static IntType = 1013
    public static UnsignedIntType = 1014
    public static FloatType = 1015

    // Pixel types
    // public static UnsignedByteType = 1009;
    public static UnsignedShort4444Type = 1016
    public static UnsignedShort5551Type = 1017
    public static UnsignedShort565Type = 1018

    // Pixel formats
    public static AlphaFormat = 1019
    public static RGBFormat = 1020
    public static RGBAFormat = 1021
    public static LuminanceFormat = 1022
    public static LuminanceAlphaFormat = 1023

    // Compressed texture formats
    public static RGB_S3TC_DXT1_Format = 2001
    public static RGBA_S3TC_DXT1_Format = 2002
    public static RGBA_S3TC_DXT3_Format = 2003
    public static RGBA_S3TC_DXT5_Format = 2004

    // // Potential future PVRTC compressed texture formats
    // public static RGB_PVRTC_4BPPV1_Format = 2100;
    // public static RGB_PVRTC_2BPPV1_Format = 2101;
    // public static RGBA_PVRTC_4BPPV1_Format = 2102;
    // public static RGBA_PVRTC_2BPPV1_Format = 2103;
}


export const THREE: any = {

}
