import mongoose from 'mongoose';
import { BoxTypeChance } from '../models/boxTypeChanceModel.js';

const seedDefaultBoxTypeChances = async () => {
    const defaultChances = [
        {
            boxType: 'LOVA',
            chances: { common: 70, uncommon: 20, rare: 8, epic: 2, legendary: 0, event: 0 },
            isDefault: true,
            createdAt: new Date()
        },
        {
            boxType: 'MEDI',
            chances: { common: 40, uncommon: 30, rare: 20, epic: 8, legendary: 2, event: 0 },
            isDefault: true,
            createdAt: new Date()
        },
        {
            boxType: 'HIGV',
            chances: { common: 10, uncommon: 20, rare: 30, epic: 25, legendary: 15, event: 0 },
            isDefault: true,
            createdAt: new Date()
        },
        {
            boxType: 'EVNT',
            chances: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, event: 100 },
            isDefault: true,
            createdAt: new Date()
        },
        {
            boxType: 'RAND',
            chances: { common: 35, uncommon: 25, rare: 20, epic: 15, legendary: 5, event: 0 },
            isDefault: true,
            createdAt: new Date()
        }
    ];

    for (const chance of defaultChances) {
        const exists = await BoxTypeChance.findOne({ boxType: chance.boxType });
        if (!exists) {
            await BoxTypeChance.create(chance);
        }
    }

    console.log('Seed dữ liệu mặc định thành công');
};

// Kết nối MongoDB và chạy seed
const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await seedDefaultBoxTypeChances();
        mongoose.connection.close();
    } catch (error) {
        console.error('Lỗi khi seed dữ liệu:', error);
        mongoose.connection.close();
    }
};

runSeed();