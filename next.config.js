/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s3.polygon.io",
				pathname: "/public/assets/news/favicons/**"
			}
		]
	}
};

module.exports = nextConfig;
