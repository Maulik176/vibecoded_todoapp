import ratelimit from '../config/upstash.js';   

const rateLimiter = async (req, res, next) => {
    try {
        const {success} = await ratelimit.limit("my-limit-key"); //success is in curly brakcet becuase it is a property of the object returned by the limit method
        if (!success) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Rate limiter error:", error);
        return res.status(500).json({ error: "Internal server error" });
        next(error); // Call next with the error to pass it to the error handling middleware
    }

}
export default rateLimiter;