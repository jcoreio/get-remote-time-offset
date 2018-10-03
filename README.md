# get-remote-time-offset

[![Build Status](https://travis-ci.org/jcoreio/get-remote-time-offset.svg?branch=master)](https://travis-ci.org/jcoreio/get-remote-time-offset)
[![Coverage Status](https://codecov.io/gh/jcoreio/get-remote-time-offset/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/get-remote-time-offset)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

algorithm to get the offset between local and remote time, using your function to fetch remote time

# Installation

```sh
npm install --save @jcoreio/get-remote-time-offset
```

# API

## `getRemoteTimeOffset(fetchRemoteTime, [options])`

```js
import {getRemoteTimeOffset} from 'get-remote-time-offset'
```

### `fetchRemoteTime: () => Promise<number>`

Your function that fetches the time on a remote server by any means you choose
(for instance making an HTTP request) and resolves to the remove server's local
time when it handled the request.

### `options?: ?Object`

Options to customize parameters

### `options.numQueries?: ?number` (default: `5`)

The number of times to fetch remote time before computing the offset

### `options.timeBetweenQueries?: ?number` (default: `10`)

The time to way between queries, in milliseconds

### `options.maxRejections?: ?number` (default: `0`)

The number of rejected promises from `getRemoteTimeOffset` to allow before
rejecting

### `options.timeout?: ?number` (default: `numQueries * timeBetweenQueries * 10`)

The maximum amount of time to run before rejecting

### Returns (`Promise<number>`)

A `Promise` that resolves to the remote time offset, in milliseconds.
Adding this number to the local time will give you the approximate remote time.
