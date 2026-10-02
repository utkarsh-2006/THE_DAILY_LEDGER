import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Architecture Boundary Verification', () => {
    it('should not contain forbidden imports in game-core', () => {
        function walk(dir: string, fileList: string[] = []) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                if (fs.statSync(filePath).isDirectory()) {
                    walk(filePath, fileList);
                } else if (filePath.endsWith('.ts')) {
                    fileList.push(filePath);
                }
            }
            return fileList;
        }

        const forbidden = [
            "from 'react'",
            'from "react"',
            "from 'next'",
            'from "next"',
            "from 'colyseus'",
            'from "colyseus"',
            "from 'drizzle-orm'",
            'from "drizzle-orm"',
            "from 'pg'",
            'from "pg"'
        ];

        let failedFiles: string[] = [];
        const files = walk(path.join(__dirname, '../src'));
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            for (const f of forbidden) {
                if (content.includes(f)) {
                    failedFiles.push(`${file}: contains ${f}`);
                }
            }
        }

        expect(failedFiles).toEqual([]);
    });
});
