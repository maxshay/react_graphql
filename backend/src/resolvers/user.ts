import { User } from '../entities'
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { MyContext } from '../types'
import argon2 from 'argon2'


@InputType()
class UsernamePasswordInput {
    @Field()
    username: string

    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}


@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register (
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> 
    {
        const loginErrors = {
            errors: [{
                field: 'register',
                message: 'Invalid \'username\' or \'password\''
            }]
        }

        if (options.username.length < 2 || options.username.length > 200) return loginErrors
        if (options.password.length < 8 || options.password.length > 200) return loginErrors


        const findUser = await em.findOne(User, {username: options.username})
        if (findUser) {
            return {
                errors: [{
                    field: 'register',
                    message: 'Username taken'
                }]
            }
        }

        const hashedPassword = await argon2.hash(options.password)



        const user = await em.create(User, {username: options.username, password: hashedPassword})

        try {
            await em.persistAndFlush(user)
        } catch {
            return {
                errors: [{
                    field: 'register',
                    message: 'Error registering'
                }]
            }
        }
        req.session!.userId = user.id
        return {user}
    }

    @Mutation(() => UserResponse)
    async login (
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> 
    {
        const loginErrors = {
            errors: [{
                field: 'login',
                message: 'Invalid \'username\' or \'password\''
            }]
        }

        if (options.username.length < 2 || options.username.length > 200) {
            return loginErrors
        }

        const user = await em.findOne(User, {username: options.username})
        if (!user) {
            return loginErrors
        }
        const validPassword = await argon2.verify(user.password, options.password)
        if (!validPassword) {
            return loginErrors
        }

        req.session!.userId = user.id

       
        return {user}
    }
    
    @Query(() => User, {nullable: true})
    async me (
        @Ctx() { em, req }: MyContext
    ): Promise<User | null> 
    {
        
        if (!req.session!.userId) {
            return null
        }
        try {
            const user = await em.findOne(User, {id: +req.session!.userId})
            return user
        } catch {
            return null
        }
        
        
    }
}