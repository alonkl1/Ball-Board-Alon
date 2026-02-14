'use strict'

function createMat(rows, cols) {
    const mat = []
    for (var i = 0; i < rows; i++) {
        const row = []
        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const idx = getRandomInt(0, i + 1)
        const temp = arr[i]
        arr[i] = arr[idx]
        arr[idx] = temp

    }
    gNums = arr
    console.log("AFTER SHUFFLE " + arr)
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function getFormattedTimePassed(timeDiff) {
    var str = ''
    const milliSeconds = timeDiff % 1000
    const seconds = Math.floor(timeDiff / 1000)

    const strSec = seconds.toString().padStart(2, '0')
    const strMs = milliSeconds.toString().padStart(1)

    return (strSec + ':' + strMs)
}