import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GroupService {

  private baseUrl = 'http://localhost:5146/api/v1/group';

  constructor(private http: HttpClient) {}

  // ===============================
  // CREATE GROUP
  // ===============================
  createGroup(name: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, {
      name,
      creatorId: localStorage.getItem('userId')
    });
  }
     
//   addMember(groupId: string, us  erId: string) {
//   return this.http.post(
//     '/api/v1/group/add-member',
//     { groupId, userId }
//   );
// }

getAllUsers() {
  return this.http.get<any[]>('http://localhost:5146/api/v1/User/users');

}

  createGroupWithMembers(
    name: string,
    memberIds: string[]
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/create-with-members`,
      { name, memberIds }
    );
  }

  // ===============================
  // SIDEBAR
  // ===============================
  getMyGroups(): Observable<any[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<any[]>(
      `${this.baseUrl}/user/${userId}`
    );
  }

  // ===============================
  // GROUP INFO (🔥 THIS IS THE KEY)
  // ===============================
  getGroupMembers(groupId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/${groupId}/members`
    );
  }

  // ===============================
  // MEMBER MANAGEMENT
  // ===============================
addMember(dto: { groupId: string; userId: string }) {
  return this.http.post(
    `${this.baseUrl}/add-member`,
    dto
  );
}




  removeMember(groupId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/remove-member`, {
      groupId,
      userId,
      adminId: localStorage.getItem('userId')
    });
  }

  changeRole(
    groupId: string,
    userId: string,
    role: number
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/change-role`, {
      groupId,
      userId,
      role
    });
  }

  leaveGroup(groupId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/leave`, {
      groupId,
      userId: localStorage.getItem('userId')
    });
  }

  // ===============================
  // GROUP CHAT HISTORY
  // ===============================
  getGroupMessages(groupId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:5146/api/v1/GroupChat/group/${groupId}`
    );
  }
}
