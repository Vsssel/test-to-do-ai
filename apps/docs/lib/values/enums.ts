export enum WORKSPACE_ROLES {
    OWNER = 'owner',
    EDITOR = 'editor',
    VIEWER = 'viewer',
}

export const WORKSPACE_PERMISSIONS = {
    CREATE_WORKSPACE: 'create:workspace',
    READ_WORKSPACE: 'read:workspace',
    UPDATE_WORKSPACE: 'update:workspace',
    DELETE_WORKSPACE: 'delete:workspace',
    CREATE_ROLE: 'create:role',
    READ_ROLE: 'read:role',
    UPDATE_ROLE: 'update:role',
    DELETE_ROLE: 'delete:role',
    CREATE_INVITATION: 'create:invitation',
    READ_INVITATION: 'read:invitation',
    UPDATE_INVITATION: 'update:invitation',
    DELETE_INVITATION: 'delete:invitation',
    DELETE_MEMBER: 'delete:member',
  }