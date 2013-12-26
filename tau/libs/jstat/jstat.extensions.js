define(['libs/jstat/jstat'], function(jStat){
    jStat.extend({
        // sum of squared errors of prediction (SSE)
        medsumsqerr : function( arr ) {
            var mean = jStat.median( arr ),
                sum = 0,
                i = arr.length,
                tmp;
            while ( --i >= 0 ) {
                tmp = arr[i] - mean;
                sum += tmp * tmp;
            }
            return sum;
        },

        medsqerr : function( arr ) {
            return jStat.medsumsqerr( arr ) / arr.length;
        }
    });

    var isFunction = jStat.utils.isFunction;

    // extend jStat.fn with methods which don't require arguments and work on columns
    (function( funcs ) {
        for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
            // if a matrix is passed, automatically assume operation should be done on the columns
            jStat.fn[ passfunc ] = function( fullbool, func ) {
                var arr = [],
                    i = 0,
                    tmpthis = this;
                // assignment reassignation depending on how parameters were passed in
                if ( isFunction( fullbool )) {
                    func = fullbool;
                    fullbool = false;
                }
                // check if a callback was passed with the function
                if ( func ) {
                    setTimeout( function() {
                        func.call( tmpthis, jStat.fn[ passfunc ].call( tmpthis, fullbool ));
                    }, 15 );
                    return this;
                }
                // check if matrix and run calculations
                if ( this.length > 1 ) {
                    tmpthis = fullbool === true ? this : this.transpose();
                    for ( ; i < tmpthis.length; i++ )
                        arr[i] = jStat[ passfunc ]( tmpthis[i] );
                    return fullbool === true ? jStat[ passfunc ]( jStat.utils.toVector(arr) ) : arr;
                }
                // pass fullbool if only vector, not a matrix. for variance and stdev
                return jStat[ passfunc ]( this[0], fullbool );
            };
        })( funcs[i] );
    })( 'medsumsqerr medsqerr'.split( ' ' ));
    return jStat;
});
