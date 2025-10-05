# Test different endpoints
$endpoints = @(
    "https://berita-indo-api-next.vercel.app/api/cnn-news/",
    "https://berita-indo-api-next.vercel.app/api/cnn/",
    "https://berita-indo-api-next.vercel.app/api/news/cnn",
    "https://berita-indo-api-next.vercel.app/cnn-news",
    "https://berita-indo-api-next.vercel.app/api/"
)

foreach ($url in $endpoints) {
    Write-Host "Testing: $url"
    try {
        $request = [System.Net.WebRequest]::Create($url)
        $request.AllowAutoRedirect = $false
        $response = $request.GetResponse()
        Write-Host "  Status: $($response.StatusCode)"
        $response.Close()
    } catch {
        $response = $_.Exception.Response
        if ($response) {
            Write-Host "  Status: $($response.StatusCode)"
            if ($response.Headers['Location']) {
                Write-Host "  Location: $($response.Headers['Location'])"
            }
        } else {
            Write-Host "  Error: $($_.Exception.Message)"
        }
    }
    Write-Host ""
}