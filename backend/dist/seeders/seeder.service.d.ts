import { OnModuleInit } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
export declare class SeederService implements OnModuleInit {
    private readonly roleSeeder;
    constructor(roleSeeder: RoleSeeder);
    onModuleInit(): Promise<void>;
    private seedRoles;
}
