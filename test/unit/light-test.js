'use strict';

var Lifx = require('../../').Client;
var Light = require('../../').Light;
var constant = require('../../').constants;
var assert = require('chai').assert;

suite('Light', () => {
  let client = null;
  let bulb = null;
  const getMsgQueueLength = () => {
    return client.messagesQueue.length;
  };
  const getMsgHandlerLength = () => {
    return client.messageHandlers.length;
  };

  beforeEach(() => {
    client = new Lifx();
    bulb = new Light({
      client: client,
      id: 'F37A4311B857',
      address: '192.168.0.1',
      port: 56700,
      seenOnDiscovery: 1
    });
  });

  afterEach(() => {
    client.destroy();
  });

  test('light status \'on\' after instanciation', () => {
    assert.equal(bulb.status, 'on');
  });

  test('turning a light on', () => {
    let currHandlerCnt = getMsgQueueLength();
    bulb.on();
    assert.equal(getMsgQueueLength(), currHandlerCnt + 1, 'sends a packet to the queue');
    currHandlerCnt += 1;

    bulb.on(200);
    assert.equal(getMsgQueueLength(), currHandlerCnt + 1, 'sends a packet to the queue');
    currHandlerCnt += 1;

    assert.throw(() => {
      bulb.on('200');
    }, RangeError);
    assert.equal(getMsgQueueLength(), currHandlerCnt, 'no package added to the queue');
  });

  test('turning a light off', () => {
    let currHandlerCnt = getMsgQueueLength();
    bulb.off();
    assert.equal(getMsgQueueLength(), currHandlerCnt + 1, 'sends a packet to the queue');
    currHandlerCnt += 1;

    bulb.off(200);
    assert.equal(getMsgQueueLength(), currHandlerCnt + 1, 'sends a packet to the queue');
    currHandlerCnt += 1;

    assert.throw(() => {
      bulb.off('200');
    }, RangeError);
    assert.equal(getMsgQueueLength(), currHandlerCnt, 'no package added to the queue');
  });

  test('changeing the color of a light', () => {
    let currHandlerCnt = getMsgQueueLength();

    // Error cases
    assert.throw(() => {
      // No arguments
      bulb.color();
    }, RangeError);

    assert.throw(() => {
      // To min arguments
      bulb.color(constant.HSBK_MINIMUM_HUE);
    }, RangeError);

    assert.throw(() => {
      // To min arguments
      bulb.color(constant.HSBK_MINIMUM_HUE, constant.HSBK_MINIMUM_SATURATION);
    }, RangeError);

    assert.throw(() => {
      // Saturation to low
      bulb.color(constant.HSBK_MINIMUM_HUE, constant.HSBK_MINIMUM_SATURATION - 1, constant.HSBK_MINIMUM_BRIGHTNESS);
    }, RangeError);

    assert.throw(() => {
      // Saturation to high
      bulb.color(constant.HSBK_MINIMUM_HUE, constant.HSBK_MAXIMUM_SATURATION + 1, constant.HSBK_MINIMUM_BRIGHTNESS);
    }, RangeError);

    assert.throw(() => {
      // Hue to low
      bulb.color(constant.HSBK_MINIMUM_HUE - 1, constant.HSBK_MINIMUM_SATURATION, constant.HSBK_MINIMUM_BRIGHTNESS);
    }, RangeError);

    assert.throw(() => {
      // Hue to high
      bulb.color(constant.HSBK_MAXIMUM_HUE + 1, constant.HSBK_MINIMUM_SATURATION, constant.HSBK_MINIMUM_BRIGHTNESS);
    }, RangeError);

    assert.throw(() => {
      // Brightness to low
      bulb.color(constant.HSBK_MINIMUM_HUE, constant.HSBK_MINIMUM_SATURATION, constant.HSBK_MINIMUM_BRIGHTNESS - 1);
    }, RangeError);

    assert.throw(() => {
      // Brightness to high
      bulb.color(constant.HSBK_MINIMUM_HUE, constant.HSBK_MINIMUM_SATURATION, constant.HSBK_MAXIMUM_BRIGHTNESS + 1);
    }, RangeError);

    assert.throw(() => {
      // Invalid duration
      bulb.color(constant.HSBK_MINIMUM_BRIGHTNESS, constant.HSBK_MAXIMUM_SATURATION, constant.HSBK_MINIMUM_BRIGHTNESS, '100');
    }, RangeError);
    assert.equal(getMsgQueueLength(), currHandlerCnt, 'no package added to the queue');

    bulb.color(constant.HSBK_MAXIMUM_BRIGHTNESS, constant.HSBK_MINIMUM_SATURATION, constant.HSBK_MAXIMUM_BRIGHTNESS);
    assert.equal(getMsgQueueLength(), currHandlerCnt + 1, 'package added to the queue');
    currHandlerCnt += 1;

    bulb.color(constant.HSBK_MINIMUM_BRIGHTNESS, constant.HSBK_MAXIMUM_SATURATION, constant.HSBK_MINIMUM_BRIGHTNESS, 100);
    assert.equal(getMsgQueueLength(), currHandlerCnt + 1, 'package added to the queue');
    currHandlerCnt += 1;
  });

  test('getting light summary', () => {
    assert.throw(() => {
      bulb.getState('test');
    }, TypeError);

    let currHandlerCnt = getMsgHandlerLength();
    bulb.getState(() => {});
    assert.equal(getMsgHandlerLength(), currHandlerCnt + 1, 'adds a handler');
    currHandlerCnt += 1;
  });

  test('getting hardware', () => {
    assert.throw(() => {
      bulb.getHardware('test');
    }, TypeError);

    let currHandlerCnt = getMsgHandlerLength();
    bulb.getHardware(() => {});
    assert.equal(getMsgHandlerLength(), currHandlerCnt + 1, 'adds a handler');
    currHandlerCnt += 1;
  });

  test('getting firmware version', () => {
    assert.throw(() => {
      bulb.getFirmwareVersion('test');
    }, TypeError);

    let currHandlerCnt = getMsgHandlerLength();
    bulb.getFirmwareVersion(() => {});
    assert.equal(getMsgHandlerLength(), currHandlerCnt + 1, 'adds a handler');
    currHandlerCnt += 1;
  });

  test('getting firmware info', () => {
    assert.throw(() => {
      bulb.getFirmwareInfo('test');
    }, TypeError);

    let currHandlerCnt = getMsgHandlerLength();
    bulb.getFirmwareInfo(() => {});
    assert.equal(getMsgHandlerLength(), currHandlerCnt + 1, 'adds a handler');
    currHandlerCnt += 1;
  });

  test('getting wifi info', () => {
    assert.throw(() => {
      bulb.getWifiInfo('test');
    }, TypeError);

    let currHandlerCnt = getMsgHandlerLength();
    bulb.getWifiInfo(() => {});
    assert.equal(getMsgHandlerLength(), currHandlerCnt + 1, 'adds a handler');
    currHandlerCnt += 1;
  });

  test('getting wifi version', () => {
    assert.throw(() => {
      bulb.getWifiVersion('test');
    }, TypeError);

    let currHandlerCnt = getMsgHandlerLength();
    bulb.getWifiVersion(() => {});
    assert.equal(getMsgHandlerLength(), currHandlerCnt + 1, 'adds a handler');
    currHandlerCnt += 1;
  });
});