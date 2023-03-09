import { NETWORK_VERSION, PROXY_BRANDING, PROXY_VERSION, VANILLA_PROTOCOL_VERSION } from "../../meta.js";
import { Enums } from "../Enums.js";
import { MineProtocol } from "../Protocol.js";
export default class SCIdentifyPacket {
    constructor() {
        this.packetId = Enums.PacketId.SCIdentifyPacket;
        this.type = "packet";
        this.boundTo = Enums.PacketBounds.C;
        this.sentAfterHandshake = false;
        this.protocolVer = NETWORK_VERSION;
        this.gameVersion = VANILLA_PROTOCOL_VERSION;
        this.branding = PROXY_BRANDING;
        this.version = PROXY_VERSION;
    }
    serialize() {
        return Buffer.concat([
            [0x02],
            MineProtocol.writeShort(this.protocolVer),
            MineProtocol.writeShort(this.gameVersion),
            MineProtocol.writeString(this.branding),
            MineProtocol.writeString(this.version),
            [0x00, 0x00, 0x00]
        ].map(arr => arr instanceof Uint8Array ? arr : Buffer.from(arr)));
    }
    deserialize(packet) {
        if (packet[0] != this.packetId)
            throw TypeError("Invalid packet ID detected!");
        packet = packet.subarray(1);
        const protoVer = MineProtocol.readShort(packet), gameVer = MineProtocol.readShort(protoVer.newBuffer), branding = MineProtocol.readString(gameVer.newBuffer), version = MineProtocol.readString(branding.newBuffer);
        this.gameVersion = gameVer.value;
        this.branding = branding.value;
        this.version = version.value;
        return this;
    }
}
