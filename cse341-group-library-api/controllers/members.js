const mongodb = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['members']
    try {
        const members = await mongodb.getDb().db().collection('members').find().toArray();
        res.setHeader('Content-Type', 'application/JSON');
        res.status(200).json(members);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const getSingle = async (req, res) => {
    //#swagger.tags=['members']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid user id to find a member');
        };
        const userId = new ObjectId(req.params.id);
        const user = await mongodb.getDb().db().collection('members').findOne({ _id: userId });;
        if (!user) {
            res.status(404).json({ message: 'Member not found' });
        }
        res.setHeader('Content-Type', 'application/JSON');
        res.status(200).json(user);
        }catch (err) {
            res.status(400).json({ message: err.message });
        }
};

const createMember = async (req, res) => {
    //#swagger.tags=['members']
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            birthday: req.body.birthday,
            borrowed: req.body.borrowed,
            feeBalance: req.body.feeBalance,
        };
        const response = await mongodb.getDb().db().collection('members').insertOne(user);
        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while creating the member');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateMember = async (req, res) => {
    //#swagger.tags=['members']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid user id to update a member');
        };
        const userId = new ObjectId(req.params.id);
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            birthday: req.body.birthday,
            borrowed: req.body.borrowed,
            feeBalance: req.body.feeBalance,
        };
        const response = await mongodb.getDb().db().collection('members').replaceOne({ _id: userId }, user);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while updating the member');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteMember = async (req, res) => {
    //#swagger.tags=['members']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid user id to delete member');
        };
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().db().collection('members').deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while deleting the member');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getAll, getSingle, createMember, updateMember, deleteMember };
