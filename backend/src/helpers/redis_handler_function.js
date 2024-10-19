const logger = require("../helpers/logger_helper")("REDIS");

const init = (redis) => {
    const setWithExpiry = async (key, value, expirytime = 86400) => {
        logger.debug("Redis: SET", key, "value", value);
        await redis.set(key, value, "EX", expirytime);
    };

    const get = async (key) => {
        const value = await redis.get(key);
        logger.debug("Redis: GET", key, "Value", value);
        return value;
    };

    const ttl = async (key) => {
        return await redis.ttl(key);
    };

    const getKeys = async (key) => {
        let cursor = "0";
        let keys = [];
        do {
            const reply = await redis.scan(cursor, "MATCH", key, "COUNT", 100);
            cursor = reply[0];
            keys = keys.concat(reply[1]);
            logger.debug(
                "REDIS: SCAN ",
                key,
                "| Cursor : ",
                cursor,
                "| Value : ",
                keys
            );
        } while (cursor !== "0");
        return keys;
    };

    const getSync = (key) => {
        const value = redis.get(key);
        logger.debug("Redis: GET", key, "Value", value);
        return value;
    };

    const deletekey = async (key) => {
        return await redis.del(key);
    };

    const expire = async (key, sec) => {
        return await redis.expire(key, sec);
    };

    const increment = async (key, val = 1) => {
        return await redis.incrby(key, val);
    };

    const addToSet = async (key, val) => {
        return await redis.sadd(key, val);
    };

    const lengthOfSet = async (key) => {
        return await redis.scard(key);
    };

    const set = async (key, value, expiry = false) => {
        //expiry in seconds
        if (expiry) {
            await redis.set(key, value, "EX", expiry);
        } else {
            await redis.set(key, value);
        }
    };

    const getJson = async (key) => {
        return await redis.call("JSON.GET", key);
    };

    // NX will create only if it doesn't exist. XX will replace only if it exists.
    const setJson = async (key, json_key, value, overwrite = "NX") => {
        await redis.call("JSON.SET", key, json_key, value, overwrite);
    };

    const delJson = async (key, json_key) => {
        return await redis.call("JSON.DEL", key, json_key);
    };

    const incrementJson = async (key, json_key, incr_by = 1) => {
        return await redis.call("JSON.NUMINCRBY", key, json_key, incr_by);
    };

    const disconnect = async () => {
        return await redis.disconnect();
    };

    const getTimeInMicroSec = async () => {
        const now = await redis.call("TIME");
        const now_us = now[0] * 1000000 + parseInt(now[1]);
        return now_us;
    };

    const zCard = async (key) => {
        const value = (await redis.call("ZCARD", key)) + 1;
        logger.debug("Redis: ZCARD", key, "value", value);
        return value;
    };

    const zAdd = async (key, mem_score, member) => {
        logger.debug(
            "Redis: ZADD",
            key,
            "member_score",
            mem_score,
            "member",
            member
        );
        return await redis.call("ZADD", key, mem_score, member);
    };

    const zRemByScore = async (key, min, max) => {
        logger.debug("Redis: ZREMRANGEBYSCORE", key, "min", min, "max", max);
        return await redis.call("ZREMRANGEBYSCORE", key, min, max);
    };

    const rpush = async (key, element) => {
        return await redis.call("RPUSH", key, element);
    };
    const lrange = async (key, start, end) => {
        return redis.call("lrange", key, start, end);
    };

    const ltrim = async (key, start, end) => {
        return redis.call("ltrim", key, start, end);
    };

    const hset = async (key, field, value) => {
        await redis.call("HSET", key, field, value);
    };

    const hexists = async (key, field) => {
        return await redis.call("hexists", key, field);
    };

    const hget = async (key, field) => {
        logger.debug("Redis: HGET", key, "field", field);
        return await redis.call("HGET", key, field);
    };

    const hgetall = async (key) => {
        return await redis.call("HGETALL", key);
    };

    const hgetallJson = async (key) => {
        const data = await hgetall(key);

        let output = undefined;
        for (let i = 0; i < data.length; i = i + 2) {
            const key_name = data[i];
            const value = data[i + 1];

            if (key_name) {
                if (!output) {
                    output = {};
                }
            }
            output[key_name] = value;
        }

        return output;
    };

    const hdel = async (key, field) => {
        return await redis.call("HDEL", key, field);
    };

    const deleteKeys = async (key) => {
        logger.debug("Redis: DeleteKeys Pattern", key);
        var keys = await getKeys(key);
        keys.map((x) => {
            logger.debug("Redis: DeleteKeys", x);
            deletekey(x);
        });
    };

    const deleteMultipleKeys = async (keys) => {
        return await redis.del(keys);
    };

    const keyExists = async (key) => {
        return await redis.call("EXISTS", key);
    };

    const zRange = async (key, start, end) => {
        var rangeValues = await redis.zrange(key, start, end);
        logger.debug("Redis: ZRANGE", key, "start, end", start, end);
        return rangeValues;
    };

    return {
        setWithExpiry,
        get,
        ttl,
        getKeys,
        getSync,
        set,
        getJson,
        setJson,
        delJson,
        incrementJson,
        deletekey,
        expire,
        increment,
        disconnect,
        getTimeInMicroSec,
        zCard,
        zAdd,
        zRemByScore,
        rpush,
        lrange,
        ltrim,
        hset,
        hexists,
        hget,
        hgetall,
        hgetallJson,
        hdel,
        deleteKeys,
        deleteMultipleKeys,
        keyExists,
        addToSet,
        lengthOfSet,
        zRange
    };
};

module.exports = { init };
