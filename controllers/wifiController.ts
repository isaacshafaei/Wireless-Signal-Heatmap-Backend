import {Request, Response} from "express";
import {Users, Wifi} from "../entities";
import {DI} from "../index";
import logger from "../config/logger";
import {geocoder} from "../helpers/geocoder";
import {QueryOrder} from "@mikro-orm/core";

async function postWifi(req: Request, res: Response) {
    try {
        const {id, name, bssid, distance, level, security, frequency, lat, lng, acc} = req.body;
        if (!id || !name || !bssid || !distance || !level || !security || !frequency) {
            res.status(400).send("Incorrect body");
            return;
        }
        const user = await DI.em.findOne(Users, {id});
        if (!user) {
            res.status(400).send("User not found");
            return;
        }

        const locs = await geocoder(lat, lng);
        const loc = locs[0];

        const wifi = DI.em.create(Wifi, {
            user,
            name,
            bssid,
            distance,
            level,
            security,
            frequency,
            lat,
            lng,
            accuracy: acc,
            city: loc.city || "",
            streetName: loc.streetName || "",
            streetNumber: loc.streetNumber || "",
            countryCode: loc.countryCode || "",
            zipcode: loc.zipcode || ""
        });

        await DI.em.persistAndFlush(wifi);

        res.status(201).send({...wifi});
    } catch (e) {
        logger.error(`postWifi: ${e}`);
    }
}

async function getUserWifi(req: Request, res: Response) {
    try {
        const {id} = req.params;
        if (!id) {
            res.status(400).send("ID not found");
            return;
        }
        const user = await DI.em.findOne(Users, {id: +id});
        if (!user) {
            res.status(400).send("User not found");
            return;
        }
        const wiFis = await DI.em.find(Wifi, {user}, {
            orderBy: {created_at: QueryOrder.DESC}, populate: [], limit: 20
        });
        res.send(wiFis);
    } catch (e) {
        logger.error(`getUserWifi: ${e}`);
    }
}

async function getWifi(req: Request, res: Response) {
    try {
        const {id} = req.params;
        const wifi = await DI.em.findOne(Wifi, {id: +id});
        if (!wifi)
            return res.status(400).send("WiFi not found");

        res.send(wifi);
    } catch (e) {
        logger.error(`getWifi: ${e}`);
    }
}

async function deleteWifi(req: Request, res: Response) {
    try {
        const {id} = req.params;
        const wifi = await DI.em.findOne(Wifi, {id: +id});
        if (!wifi)
            return res.status(400).send("WiFi not found");

        await DI.em.removeAndFlush(wifi);

        res.send('OK');
    } catch (e) {
        logger.error(`getWifi: ${e}`);
    }
}

async function getWifis(req: Request, res: Response) {
    try {
        const wifis = await DI.em.find(Wifi, {}, { populate: [] });
        if (!wifis)
            return res.status(400).send("WiFis not found");

        res.send(wifis);
    } catch (e) {
        logger.error(`getWifis: ${e}`);
    }
}

export {postWifi, getUserWifi, getWifi, getWifis, deleteWifi};