using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class aaa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupMessageSeen_GroupMessages_GroupMessageId",
                table: "GroupMessageSeen");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupMessageSeen",
                table: "GroupMessageSeen");

            migrationBuilder.DropColumn(
                name: "SenderName",
                table: "GroupMessages");

            migrationBuilder.RenameTable(
                name: "GroupMessageSeen",
                newName: "GroupMessageSeens");

            migrationBuilder.RenameIndex(
                name: "IX_GroupMessageSeen_GroupMessageId",
                table: "GroupMessageSeens",
                newName: "IX_GroupMessageSeens_GroupMessageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupMessageSeens",
                table: "GroupMessageSeens",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupMessageSeens_GroupMessages_GroupMessageId",
                table: "GroupMessageSeens",
                column: "GroupMessageId",
                principalTable: "GroupMessages",
                principalColumn: "GroupMessageId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupMessageSeens_GroupMessages_GroupMessageId",
                table: "GroupMessageSeens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupMessageSeens",
                table: "GroupMessageSeens");

            migrationBuilder.RenameTable(
                name: "GroupMessageSeens",
                newName: "GroupMessageSeen");

            migrationBuilder.RenameIndex(
                name: "IX_GroupMessageSeens_GroupMessageId",
                table: "GroupMessageSeen",
                newName: "IX_GroupMessageSeen_GroupMessageId");

            migrationBuilder.AddColumn<string>(
                name: "SenderName",
                table: "GroupMessages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupMessageSeen",
                table: "GroupMessageSeen",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupMessageSeen_GroupMessages_GroupMessageId",
                table: "GroupMessageSeen",
                column: "GroupMessageId",
                principalTable: "GroupMessages",
                principalColumn: "GroupMessageId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
