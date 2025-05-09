declare namespace App {
    interface User {
        id: number;
        name: string;
        email: string;
    }
    
    interface Travel {
        id: number;
        user_id: number;
        title: string;
        destination: string;
        start_date: string;
        end_date: string;
    }
}