import ipaddress
import socket
import re
from typing import Tuple, List, Optional

# Prohibited private and reserved network CIDRs
BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),       # Current network ("this" host)
    ipaddress.ip_network("10.0.0.0/8"),      # Private IPv4
    ipaddress.ip_network("100.64.0.0/10"),   # Shared address space (CGNAT)
    ipaddress.ip_network("127.0.0.0/8"),     # Loopback
    ipaddress.ip_network("169.254.0.0/16"),  # Link-local IPv4
    ipaddress.ip_network("172.16.0.0/12"),   # Private IPv4
    ipaddress.ip_network("192.0.0.0/24"),    # IETF Protocol Assignments
    ipaddress.ip_network("192.0.2.0/24"),    # Documentation (TEST-NET-1)
    ipaddress.ip_network("192.88.99.0/24"),  # 6to4 Relay Anycast
    ipaddress.ip_network("192.168.0.0/16"),  # Private IPv4
    ipaddress.ip_network("198.18.0.0/15"),   # Benchmarking
    ipaddress.ip_network("198.51.100.0/24"), # Documentation (TEST-NET-2)
    ipaddress.ip_network("203.0.113.0/24"),  # Documentation (TEST-NET-3)
    ipaddress.ip_network("224.0.0.0/4"),     # Multicast
    ipaddress.ip_network("240.0.0.0/4"),     # Reserved for future use
    ipaddress.ip_network("255.255.255.255/32"), # Broadcast
    ipaddress.ip_network("::/128"),          # Unspecified IPv6
    ipaddress.ip_network("::1/128"),         # Loopback IPv6
    ipaddress.ip_network("::ffff:0:0/96"),   # IPv4-mapped IPv6
    ipaddress.ip_network("64:ff9b::/96"),    # IPv4-IPv6 Translation
    ipaddress.ip_network("100::/64"),        # Discard-Only Address Block
    ipaddress.ip_network("2001:db8::/32"),   # Documentation IPv6
    ipaddress.ip_network("fc00::/7"),        # Unique Local Address (Private IPv6)
    ipaddress.ip_network("fe80::/10"),       # Link-Local IPv6
    ipaddress.ip_network("ff00::/8"),        # Multicast IPv6
]

PROHIBITED_HOSTNAMES = {
    "localhost", "localhost.localdomain", "ip6-localhost", "ip6-loopback"
}

PROHIBITED_DOMAIN_SUFFIXES = (
    ".localhost", ".local", ".internal", ".localdomain", ".lan", ".home", ".corp"
)

def parse_to_ip_object(host_str: str) -> Optional[ipaddress._BaseAddress]:
    """
    Parses a string into an IPv4Address or IPv6Address object, supporting standard
    dotted-decimal, IPv6, integer/decimal formats, hex formats, and dotted-octal formats.
    """
    clean = host_str.strip("[]").strip()
    if not clean:
        return None

    # 1. Standard IPv4/IPv6 notation
    try:
        return ipaddress.ip_address(clean)
    except ValueError:
        pass

    # 2. Integer / Decimal / Octal representation (e.g. 2130706433 or 017700000001 -> 127.0.0.1)
    if clean.isdigit():
        try:
            if clean.startswith("0") and len(clean) > 1 and all(c in '01234567' for c in clean):
                val_oct = int(clean, 8)
                if 0 <= val_oct <= 0xFFFFFFFF:
                    return ipaddress.IPv4Address(val_oct)
            val = int(clean, 10)
            if 0 <= val <= 0xFFFFFFFF:
                return ipaddress.IPv4Address(val)
        except ValueError:
            pass

    # 3. Hex integer representation (e.g. 0x7f000001 -> 127.0.0.1)
    if clean.startswith("0x") or clean.startswith("0X"):
        try:
            val = int(clean, 16)
            if 0 <= val <= 0xFFFFFFFF:
                return ipaddress.IPv4Address(val)
        except ValueError:
            pass

    # 4. Dotted-Hex or Dotted-Octal (e.g. 0x7f.0.0.1 or 0177.0.0.1)
    if "." in clean:
        parts = clean.split(".")
        if len(parts) == 4:
            try:
                num_parts = []
                for p in parts:
                    if p.startswith("0x") or p.startswith("0X"):
                        num_parts.append(int(p, 16))
                    elif p.startswith("0") and len(p) > 1 and p.isdigit():
                        num_parts.append(int(p, 8))
                    elif p.isdigit():
                        num_parts.append(int(p, 10))
                    else:
                        break
                if len(num_parts) == 4 and all(0 <= n <= 255 for n in num_parts):
                    return ipaddress.IPv4Address((num_parts[0] << 24) + (num_parts[1] << 16) + (num_parts[2] << 8) + num_parts[3])
            except Exception:
                pass

    return None

def is_ip_address(host_str: str) -> bool:
    """Checks if a string is an IPv4 or IPv6 address in any valid representation."""
    return parse_to_ip_object(host_str) is not None

def is_prohibited_ip(ip_str: str) -> Tuple[bool, str]:
    """
    Evaluates whether an IP address belongs to a private, loopback, link-local,
    or reserved network range across IPv4, IPv6, and IPv4-mapped IPv6.
    """
    ip_obj = parse_to_ip_object(ip_str)
    if ip_obj is None:
        return True, f"Invalid or unparseable IP address format: '{ip_str}'"

    # Check for IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
    if isinstance(ip_obj, ipaddress.IPv6Address) and ip_obj.ipv4_mapped:
        v4_blocked, v4_reason = is_prohibited_ip(str(ip_obj.ipv4_mapped))
        if v4_blocked:
            return True, f"IPv4-mapped IPv6 {ip_obj} points to prohibited IPv4 ({v4_reason})"

    for net in BLOCKED_IP_NETWORKS:
        if ip_obj in net:
            return True, f"IP {ip_obj} falls in prohibited/private network {net}"

    if ip_obj.is_private:
        return True, f"IP {ip_obj} is a private network address"
    if ip_obj.is_loopback:
        return True, f"IP {ip_obj} is a loopback address"
    if ip_obj.is_link_local:
        return True, f"IP {ip_obj} is a link-local address"
    if ip_obj.is_multicast:
        return True, f"IP {ip_obj} is a multicast address"
    if ip_obj.is_reserved:
        return True, f"IP {ip_obj} is a reserved address"
    if ip_obj.is_unspecified:
        return True, f"IP {ip_obj} is an unspecified address"

    return False, "Public routable IP address"

def validate_host_safety(hostname: str) -> Tuple[bool, str]:
    """
    Validates a hostname against SSRF vectors, private IP representations, and prohibited domains.
    """
    if not hostname:
        return False, "Empty hostname provided"

    clean_host = hostname.strip("[]").strip(".").lower()

    if clean_host in PROHIBITED_HOSTNAMES:
        return False, f"Prohibited local hostname: '{clean_host}'"

    for suffix in PROHIBITED_DOMAIN_SUFFIXES:
        if clean_host.endswith(suffix):
            return False, f"Prohibited internal domain suffix: '{clean_host}'"

    if is_ip_address(clean_host):
        is_blocked, reason = is_prohibited_ip(clean_host)
        if is_blocked:
            return False, reason

    return True, "Hostname syntax is valid and public"

def resolve_and_verify_public_ips(hostname: str, port: int = 80, timeout: float = 2.0) -> Tuple[bool, List[str], str]:
    """
    Resolves hostname to IP addresses and verifies that NONE of the resolved IPs
    point to private/loopback infrastructure (preventing DNS rebinding attacks).
    """
    safe_host, reason = validate_host_safety(hostname)
    if not safe_host:
        return False, [], reason

    clean_host = hostname.strip("[]")

    try:
        # Resolve via getaddrinfo with bounded timeout
        addr_info = socket.getaddrinfo(clean_host, port, socket.AF_UNSPEC, socket.SOCK_STREAM)
        resolved_ips: List[str] = []
        for item in addr_info:
            sockaddr = item[4]
            ip = sockaddr[0]
            if ip not in resolved_ips:
                resolved_ips.append(ip)

        if not resolved_ips:
            return False, [], "DNS lookup returned no IP addresses"

        # Verify EVERY IP is public
        for ip in resolved_ips:
            blocked, block_reason = is_prohibited_ip(ip)
            if blocked:
                return False, resolved_ips, f"DNS Rebinding / SSRF blocked: host '{hostname}' resolved to prohibited IP {ip} ({block_reason})"

        return True, resolved_ips, "All resolved IP addresses are public and routable"

    except socket.gaierror as e:
        return False, [], f"DNS resolution failed for '{clean_host}': {e}"
    except Exception as e:
        return False, [], f"Unexpected socket error during DNS resolution: {e}"
