import { XadesCollection, XadesObject } from "./xml_base";
import { DigestAlgAndValueType } from "./signing_certificate";
/**
 *
 * <xsd:element name="SigningCertificateV2" type="CertIDListV2Type"/>
 * <xsd:complexType name="CertIDListV2Type">
 *     <xsd:sequence>
 *         <xsd:element name="Cert" type="CertIDTypeV2" maxOccurs="unbounded"/>
 *     </xsd:sequence>
 * </xsd:complexType>
 * <xsd:complexType name="CertIDTypeV2">
 *     <xsd:sequence>
 *         <xsd:element name="CertDigest" type="DigestAlgAndValueType"/>
 *         <xsd:element name="IssuerSerialV2" type="xsd:base64Binary" minOccurs="0"/>
 *     </xsd:sequence>
 *     <xsd:attribute name="URI" type="xsd:anyURI" use="optional"/>
 * </xsd:complexType>
 *
 */
export declare class CertV2 extends XadesObject {
    CertDigest: DigestAlgAndValueType;
    IssuerSerial: Uint8Array;
    Uri: string;
}
export declare class CertIDListV2 extends XadesCollection<CertV2> {
}
export declare class SigningCertificateV2 extends CertIDListV2 {
}
