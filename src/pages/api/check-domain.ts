export const prerender = false;

export async function GET({ url }: { url: URL }) {
  const domain = url.searchParams.get('domain');

  if (!domain) {
    return new Response(JSON.stringify({ error: 'Domain parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check domain availability using DNS lookup
    // This is a simplified check - in production, you'd use a domain registrar API
    const available = await checkDomainAvailability(domain);

    return new Response(JSON.stringify({ domain, available }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error checking domain:', error);
    return new Response(JSON.stringify({ error: 'Failed to check domain availability' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function checkDomainAvailability(domain: string): Promise<boolean> {
  try {
    // Use Google DNS API to check domain
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    
    if (!dnsResponse.ok) {
      console.log(`DNS API error for ${domain}, assuming available`);
      return true;
    }
    
    const dnsData = await dnsResponse.json();
    
    console.log(`DNS check for ${domain}:`, JSON.stringify(dnsData));
    
    // Status 3 = NXDOMAIN (domain does not exist)
    // This is the most reliable indicator that a domain is AVAILABLE
    if (dnsData.Status === 3) {
      console.log(`${domain} - NXDOMAIN (Status 3) - AVAILABLE ✓`);
      return true;
    }
    
    // If there are DNS Answer records, the domain has active DNS
    // This means it's REGISTERED and IN USE
    if (dnsData.Answer && dnsData.Answer.length > 0) {
      console.log(`${domain} - Has DNS records - NOT AVAILABLE ✗`);
      return false;
    }
    
    // Status 0 = NOERROR (query successful)
    // If Status is 0 but no Answer records, the domain might be:
    // - Registered but not configured (parked)
    // - Registered but no A record
    if (dnsData.Status === 0) {
      console.log(`${domain} - NOERROR but no A records - likely NOT AVAILABLE ✗`);
      return false;
    }
    
    // For any other status (2 = SERVFAIL, etc), assume available
    console.log(`${domain} - Status ${dnsData.Status} - assuming AVAILABLE ✓`);
    return true;
    
  } catch (error) {
    console.error(`Error checking ${domain}:`, error);
    // On error, assume available to avoid false negatives
    return true;
  }
}
