import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  category: string;

  // stored as JSON text in SQLite, exposed as string[]
  @Column({
    type: 'text',
    transformer: {
      to: (v: string[]) => JSON.stringify(v ?? []),
      from: (v: string) => (v ? JSON.parse(v) : []),
    },
  })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
