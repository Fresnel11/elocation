import { OnModuleInit } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
import { CategorySeeder } from './category.seeder';
import { UserSeeder } from './user.seeder';
import { AdSeeder } from './ad.seeder';
export declare class SeederService implements OnModuleInit {
    private readonly roleSeeder;
    private readonly categorySeeder;
    private readonly userSeeder;
    private readonly adSeeder;
    constructor(roleSeeder: RoleSeeder, categorySeeder: CategorySeeder, userSeeder: UserSeeder, adSeeder: AdSeeder);
    onModuleInit(): Promise<void>;
    private seedRoles;
    private seedCategories;
    private seedUsers;
    private seedAds;
}
