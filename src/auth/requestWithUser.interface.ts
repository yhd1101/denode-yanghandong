import { User } from "src/user/entities/user.entity"

export interface RequestWithUserInterface extends Request {
    user: User;
}