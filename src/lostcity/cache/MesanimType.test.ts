import fs from 'fs';

import Packet from '#jagex2/io/Packet.js';

import MesanimType from '#lostcity/cache/MesanimType.js';

describe('MesanimType', () => {
    describe('static load', () => {
        it('should load data from mesanim.dat', () => {
            const dat = new Packet();

            fs.existsSync = jest.fn().mockReturnValue(true);
            Packet.load = jest.fn().mockReturnValue(dat);

            MesanimType.load('/path/to/data');

            expect(Packet.load).toHaveBeenCalledWith('/path/to/data/mesanim.dat');
        });

        it('should return early if mesanim.dat does not exist', () => {
            fs.existsSync = jest.fn().mockReturnValue(false);
            Packet.load = jest.fn().mockReturnValue(undefined);

            expect(MesanimType.load('/path/to/data')).toBeUndefined();
            expect(Packet.load).not.toHaveBeenCalled();
        });

        it('should decode packet', () => {
            const packet = new Packet();
            packet.p1(1); // opcode
            packet.p2(2); // len[0]
            packet.p1(4); // opcode
            packet.p2(5); // len[3]
            packet.p1(250); // opcode
            packet.pjstr('testName');
            packet.pos = 0; // set pos to 0 for reading

            const instance = new MesanimType(1);
            instance.decodeType(packet);

            expect(instance.len[0]).toBe(2);
            expect(instance.len[3]).toBe(5);
            expect(instance.debugname).toBe('testName');
        });
    });
});
